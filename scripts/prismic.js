(function () {
  const API_VERSION = "v2";

  async function fetchPrismicRef(repositoryName, accessToken) {
    const endpoint = `https://${repositoryName}.cdn.prismic.io/api/${API_VERSION}`;
    const response = await fetch(withAccessToken(endpoint, accessToken));
    if (!response.ok) {
      throw new Error(`Unable to load Prismic API (${response.status})`);
    }
    const json = await response.json();
    const master = json.refs && json.refs.find((ref) => ref.isMasterRef || ref.id === "master");
    if (!master) {
      throw new Error("Prismic master ref not found");
    }
    return master.ref;
  }

  function withAccessToken(url, accessToken) {
    if (!accessToken) return url;
    const target = new URL(url);
    target.searchParams.set("access_token", accessToken);
    return target.toString();
  }

  async function fetchPrismicDocument({ repositoryName, documentType, documentUID, accessToken }) {
    if (!repositoryName) return null;
    const ref = await fetchPrismicRef(repositoryName, accessToken);
    const endpoint = new URL(`https://${repositoryName}.cdn.prismic.io/api/${API_VERSION}/documents/search`);
    endpoint.searchParams.set("ref", ref);
    if (documentUID) {
      endpoint.searchParams.append("q", `[[at(my.${documentType}.uid,"${documentUID}")]]`);
    } else {
      endpoint.searchParams.append("q", `[[at(document.type,"${documentType}")]]`);
    }
    endpoint.searchParams.set("lang", "*");
    const url = withAccessToken(endpoint.toString(), accessToken);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Unable to load Prismic document (${response.status})`);
    }
    const json = await response.json();
    if (!json.results || !json.results.length) {
      return null;
    }
    return json.results[0];
  }

  function richTextToPlainText(value) {
    if (!Array.isArray(value)) {
      return typeof value === "string" ? value : "";
    }
    return value
      .map((block) => {
        if (!block) return "";
        if (block.text) return block.text;
        if (block.spans && Array.isArray(block.spans) && block.spans.length && block.content) {
          return block.content;
        }
        return "";
      })
      .join("\n\n")
      .trim();
  }

  function mapPrismicDocument(doc) {
    if (!doc || !doc.data) return null;
    const data = doc.data;

    const ginItems = Array.isArray(data.gin_items)
      ? data.gin_items.map((item) => ({
          title: item?.title || item?.gin_item_title || "",
          description: richTextToPlainText(item?.description || item?.gin_item_description || ""),
          image: item?.image?.url || item?.gin_item_image?.url || "",
          alt: item?.image?.alt || item?.gin_item_image?.alt || "",
        }))
      : [];

    const cocktailItems = Array.isArray(data.cocktails)
      ? data.cocktails.map((item) => ({
          title: item?.title || item?.cocktail_title || "",
          description: richTextToPlainText(item?.description || item?.cocktail_description || ""),
          meta: richTextToPlainText(item?.meta || item?.cocktail_meta || ""),
          image: item?.image?.url || item?.cocktail_image?.url || "",
          alt: item?.image?.alt || item?.cocktail_image?.alt || "",
        }))
      : Array.isArray(data.cocktail_items)
      ? data.cocktail_items.map((item) => ({
          title: item?.title || item?.cocktail_title || "",
          description: richTextToPlainText(item?.description || item?.cocktail_description || ""),
          meta: richTextToPlainText(item?.meta || item?.cocktail_meta || ""),
          image: item?.image?.url || item?.cocktail_image?.url || "",
          alt: item?.image?.alt || item?.cocktail_image?.alt || "",
        }))
      : [];

    const howToImages = Array.isArray(data.how_to_images)
      ? data.how_to_images.map((item) => ({
          src: item?.image?.url || "",
          alt: item?.image?.alt || "",
        }))
      : [];

    return {
      hero: {
        question: data.hero_question || "",
        lineOne: data.hero_line_one || "",
        lineTwo: data.hero_line_two || "",
        background: data.hero_background?.url || "",
      },
      story: {
        body: richTextToPlainText(data.story_body || data.story_copy || ""),
        title: data.story_title || "",
        background: data.story_background?.url || "",
      },
      products: {
        gin: {
          title: data.gin_title || "",
          tagline: data.gin_tagline || "",
          items: ginItems,
        },
        vodka: {
          title: data.vodka_title || "",
          tagline: data.vodka_tagline || "",
          description: richTextToPlainText(data.vodka_description || ""),
          image: data.vodka_image?.url || "",
          alt: data.vodka_image?.alt || "",
        },
      },
      cocktailIntro: {
        eyebrow: data.cocktail_intro_eyebrow || data.cocktail_eyebrow || "",
        title: data.cocktail_intro_title || data.cocktail_title || "",
        subtitle: data.cocktail_intro_subtitle || "",
        footnote: data.cocktail_intro_footnote || data.cocktail_footnote || "",
        background: data.cocktail_intro_background?.url || "",
        copy: richTextToPlainText(data.cocktail_intro_copy || data.cocktail_copy || ""),
      },
      cocktails: {
        title: data.cocktails_title || data.cocktail_section_title || "",
        tagline: data.cocktails_tagline || data.cocktail_section_tagline || "",
        background: data.cocktails_background?.url || data.cocktail_section_background?.url || "",
        items: cocktailItems,
      },
      howTo: {
        title: data.how_to_title || "",
        tagline: data.how_to_tagline || "",
        images: howToImages,
      },
    };
  }

  function deepMerge(base, override) {
    if (!override) return base;
    if (Array.isArray(base) && Array.isArray(override)) {
      return override.length ? override : base;
    }
    if (typeof base === "object" && base && typeof override === "object" && override) {
      const result = { ...base };
      Object.keys(override).forEach((key) => {
        if (key in base) {
          result[key] = deepMerge(base[key], override[key]);
        } else {
          result[key] = override[key];
        }
      });
      return result;
    }
    return override || base;
  }

  async function loadPrismicContent(config) {
    if (!config || !config.repositoryName) return null;
    try {
      const doc = await fetchPrismicDocument(config);
      if (!doc) return null;
      return mapPrismicDocument(doc);
    } catch (error) {
      console.warn("Prismic content could not be loaded:", error);
      return null;
    }
  }

  function getValueFromPath(source, path) {
    if (!source || !path) return null;
    const parts = path.split(".");
    let current = source;
    for (const raw of parts) {
      if (current == null) return null;
      const arrayMatch = raw.match(/(.+)\[(\d+)]/);
      if (arrayMatch) {
        const [, key, index] = arrayMatch;
        current = current[key];
        current = Array.isArray(current) ? current[Number(index)] : null;
      } else if (raw.match(/\d+/) && Array.isArray(current)) {
        current = current[Number(raw)];
      } else {
        current = current[raw];
      }
    }
    return current;
  }

  function applyContentToDOM(content) {
    if (!content) return;
    const elements = document.querySelectorAll("[data-content-key]");
    elements.forEach((element) => {
      const key = element.getAttribute("data-content-key");
      if (!key) return;
      const value = getValueFromPath(content, key);
      if (value == null || value === "") return;
      const type = element.getAttribute("data-content-type") || "text";
      switch (type) {
        case "image": {
          if (element.tagName === "IMG") {
            element.setAttribute("src", value);
            const altKey = element.getAttribute("data-alt-key");
            const altValue = altKey ? getValueFromPath(content, altKey) : null;
            if (altValue) {
              element.setAttribute("alt", altValue);
            }
          }
          break;
        }
        case "background": {
          // Set both CSS variable and direct background-image as a compatibility fallback
          // Some environments may not resolve var() in background-image as expected.
          element.style.setProperty("--section-bg", `url('${value}')`);
          element.style.backgroundImage = `url('${value}')`;
          break;
        }
        case "html": {
          element.innerHTML = value;
          break;
        }
        default: {
          element.textContent = value;
        }
      }
    });
  }

  window.loadPrismicContent = loadPrismicContent;
  window.applyCuriousContent = function applyCuriousContent(remoteContent) {
    const merged = deepMerge(window.defaultContent || {}, remoteContent || {});
    applyContentToDOM(merged);
  };

  window.initializeCuriousPage = async function initializeCuriousPage() {
    const fallback = window.defaultContent || {};
    let content = fallback;
    if (window.prismicConfig && window.prismicConfig.repositoryName) {
      const remote = await loadPrismicContent(window.prismicConfig);
      if (remote) {
        content = deepMerge(fallback, remote);
      }
    }
    applyContentToDOM(content);
  };
})();
