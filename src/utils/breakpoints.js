const SIZES = {
    zeroToExtraSmall: {
        min: 0,
        max: 468
    },
    zeroToSmall: {
        min: 0,
        max: 768
    },
    smallToMedium: {
        min: 768,
        max: 992
    },
    mediumToLarge: {
        min: 992,
        max: 1200
    },
    isLargeToBeyond: {
        min: 1200
    }
};

export const isZeroToExtraSmall = function() {
  const width = window.innerWidth;

  return width >= SIZES.zeroToExtraSmall.min && width < SIZES.zeroToExtraSmall.max;
};

export const isZeroToSmall = function() {
    const width = window.innerWidth;

    return width >= SIZES.zeroToSmall.min && width < SIZES.zeroToSmall.max;
};

export const isSmallToMedium = function() {
    const width = window.innerWidth;

    return width >= SIZES.smallToMedium.min && width < SIZES.smallToMedium.max;
};

export const isMediumToLarge = function() {
    const width = window.innerWidth;

    return width >= SIZES.mediumToLarge.min && width < SIZES.mediumToLarge.max;
};

export const isLargeToBeyond = function() {
    const width = window.innerWidth;

    return width >= SIZES.isLargeToBeyond.min;
};