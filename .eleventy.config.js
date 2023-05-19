module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"src/uploads": "static/uploads"});
  eleventyConfig.addPassthroughCopy("src/static/js");
  eleventyConfig.addPassthroughCopy("src/static/img");
  eleventyConfig.addPassthroughCopy("src/static/css");
  // eleventyConfig.addPassthroughCopy("src/static/fonts");
  eleventyConfig.addPassthroughCopy("src/static/components");
  eleventyConfig.addPassthroughCopy("src/static/store");
  eleventyConfig.addPassthroughCopy({ "src/static/utils": "static/js/utils" });
  // Copy Netlify CMS assets to the output folder
  eleventyConfig.addPassthroughCopy({ "src/static/admin" : "/admin" });
  eleventyConfig.addPassthroughCopy({ "src/static/lab" : "/lab" });

  // copy Parcel output to _site folder
  eleventyConfig.addPassthroughCopy('dist/');
  // create tunnel with browser-sync
  eleventyConfig.setBrowserSyncConfig({
    tunnel: true
  });

    return {
      dir: {
        // ⚠️ These values are both relative to your input directory.
        includes: "_includes",
        //layouts: "_layouts",
        Input: "src",
        https: true
      },
    }
};