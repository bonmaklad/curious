(function () {
  const textBlock =
    "People say gin was invented by monks, but there’s no way anyone but a gardener would have thought to infuse a spirit with such a cornucopia of botanicals.";

  window.defaultContent = {
    hero: {
      question: "CURIOUS?",
      lineOne: "C U R I O U S",
      lineTwo: "G A R D E N",
      background: "Images/Curious_Garden_Abstract_Pink.jpg",
    },
    story: {
      body: textBlock,
      title: "CURIOUS\nGARDEN",
      background: "Images/Curious_Garden_Abstract-Dry.jpg",
    },
    products: {
      gin: {
        title: "GIN",
        tagline: "every sip blossoms.",
        items: [
          {
            title: "Classic Dry Gin",
            description:
              "This classic dry gin is exceptionally smooth with an elegant hit of juniper and subtle citrus, accompanied by light, bright spice. Refined yet vibrant, like a parterre bursting with new growth.",
            image: "Images/Curious_Garden_Bottle-Dry_Mockup.png",
            alt: "Curious Garden Classic Dry Gin bottle",
          },
          {
            title: "Delicate Pink Gin",
            description:
              "This delicate pink gin has subtle, sweet floral highlights. Soft and uplifting, like the rose blooms that light up Aotearoa in spring.",
            image: "Images/Curious_Garden_Bottle-Pink_Mockup.png",
            alt: "Curious Garden Delicate Pink Gin bottle",
          },
          {
            title: "Blush Pink Gin",
            description:
              "This blush pink gin is a juicy burst of succulent grapefruit and tangy lemon. Fresh and zesty, just like all those citrus trees in gardens across Aotearoa.",
            image: "Images/Curious_Garden_Bottle-Mockup-COLOURED.png",
            alt: "Curious Garden Blush Pink Gin bottle",
          },
        ],
      },
      vodka: {
        title: "VODKA",
        tagline: "every sip warms the spirit.",
        description:
          "This classic vodka is smooth and refined, with a subtle zest set off by the purity of Canterbury’s pristine artesian water.",
        image: "Images/Curious_Garden_Vodka.png",
        alt: "Curious Garden Vodka bottle",
      },
    },
    cocktailIntro: {
      eyebrow: "twist. shake & pour.",
      title: "CURIOUS COCKTAILS",
      subtitle: "WATERMELON GIN SOUR",
      footnote: "MADE WITH CURIOUS GARDEN DRY GIN",
      background: "Images/Curious_Garden_Abstract_Grapefruit.jpg",
      copy: textBlock,
    },
    cocktails: {
      title: "COCKTAILS",
      tagline: "twist.shake.pour.",
      background: "Images/Curious_Garden_Abstract_Vodka.jpg",
      items: [
        {
          title: "Tropical Martini",
          description:
            "Tropical Martini balances the refreshing tartness of passionfruit with the heady flavour of guava for a fragrant, fruity drink. A luscious dose of paradise to transport you to good times.",
          meta:
            "This Curious Cocktail is made with Curious Garden Vodka, a smooth, refined vodka with a subtle zest.",
          image: "Images/Curious_Garden_Bottle-Mockup-COLOURED.png",
          alt: "Curious Garden cocktail bottle",
        },
        {
          title: "Watermelon Gin Sour",
          description:
            "Watermelon Gin Sour blends the refreshing sweetness of watermelon with tangy citrus for a tart, juicy taste sensation. Get the party started with this explosion of flavour.",
          meta:
            "This Curious Cocktail is made with Curious Garden Classic Dry Gin, a smooth gin with an elegant hit of juniper and subtle citrus, accompanied by light, bright spice.",
          image: "Images/Curious_Garden_Bottle-Pink_Mockup.png",
          alt: "Curious Garden Watermelon Gin Sour bottle",
        },
        {
          title: "Espresso Martini",
          description:
            "Espresso Martini infuses a rich, aromatic brew of Brazilian coffee with a kick of spirit and a smooth, creamy finish. A warming, velvety pick-me up to be savoured with friends.",
          meta:
            "This Curious Cocktail is made with Curious Garden Vodka, a smooth, refined vodka with a subtle zest.",
          image: "Images/Curious_Garden_Vodka.png",
          alt: "Curious Garden Espresso Martini bottle",
        },
      ],
    },
    howTo: {
      title: "HOW\nTO\nSERVE",
      tagline: "twist.shake.pour.",
      images: [
        {
          src: "Images/Curious_Garden_Bottle-Pink_Mockup.png",
          alt: "Serve suggestion with pink gin",
        },
        {
          src: "Images/Curious_Garden_Bottle-Mockup-COLOURED.png",
          alt: "Serve suggestion with grapefruit gin",
        },
        {
          src: "Images/Curious_Garden_Vodka.png",
          alt: "Serve suggestion with vodka",
        },
      ],
    },
  };
})();
