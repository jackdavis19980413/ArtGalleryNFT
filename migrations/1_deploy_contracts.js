// SPDX-License-Identifier: MIT
const ArtGalleryNFT = artifacts.require("ArtGalleryNFT");

module.exports = async function (deployer) {
  await deployer.deploy(ArtGalleryNFT);
};
