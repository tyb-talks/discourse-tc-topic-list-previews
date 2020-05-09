import {iconHTML} from 'discourse-common/lib/icon-library';

var isThumbnail = function (path) {
  return (
    typeof path === 'string' &&
    path !== 'false' &&
    path !== 'nil' &&
    path !== 'null' &&
    path !== ''
  );
};

var previewUrl = function (thumbnails) {
  if (thumbnails) {
    const resLevel = window.devicePixelRatio >= 2
      ? settings.topic_list_thumbnail_resolution_level - 1 < 0
          ? 0
          : settings.topic_list_thumbnail_resolution_level - 1
      : settings.topic_list_thumbnail_resolution_level;
    return resLevel <= thumbnails.length - 1
      ? thumbnails[resLevel].url
      : thumbnails[thumbnails.length - 1].url;
  } else {
    return false;
  }
};

var renderUnboundPreview = function (thumbnails, params) {
  const url = previewUrl (thumbnails);

  if (!url) return '';

  const opts = params.opts || {};

  if ((!opts.tilesStyle && Discourse.Site.currentProp ('mobileView'))) {
    return `<img class="thumbnail" src="${url}"/>`;
  }

  if (opts.featured == true) {
    return `<img class="thumbnail" src="${url}"/>`;
  }

  const attrWidthSuffix = opts.tilesStyle ? '%' : 'px';
  const attrHeightSuffix = opts.tilesStyle ? '' : 'px';
  const css_classes = opts.tilesStyle
    ? 'thumbnail tiles-thumbnail'
    : 'thumbnail';

  const category_width = params.category
    ? params.category.topic_list_thumbnail_width
    : false;
  const category_height = params.category
    ? params.category.topic_list_thumbnail_height
    : false;
  const featured_width = 'auto'
  // opts.featured
//    ? settings.topic_list_featured_width
        //? settings.topic_list_featured_width
        //: 'auto'
    //: false;
  const featured_height = 'auto';//opts.featured
    //? settings.topic_list_featured_height
    //: false;
  const tiles_width = opts.tilesStyle ? '100' : false;
  const tiles_height = opts.tilesStyle ? 'auto' : false;
  const custom_width = opts.thumbnailWidth ? opts.thumbnailWidth : false;
  const custom_height = opts.thumbnailHeight ? opts.thumbnailHeight : false;

  const height =
    custom_height ||
    tiles_height ||
    featured_height ||
    category_height ||
    settings.topic_list_thumbnail_height;
  const width =
    custom_width ||
    tiles_width ||
    featured_width ||
    category_width ||
    settings.topic_list_thumbnail_width;
  const height_style = height ? `height:${height}${attrHeightSuffix};` : ``;
  const style = `${height_style}width:${width}${attrWidthSuffix}`;

  return `<img class="${css_classes}" src="${url}" style="${style}" />`;
};

var testImageUrl = function (thumbnails, callback) {
  const url = previewUrl (thumbnails);
  let timeout = settings.topic_list_test_image_url_timeout;
  let timer, img = new Image ();
  img.onerror = img.onabort = function () {
    clearTimeout (timer);
    callback (false);
  };
  img.onload = function () {
    clearTimeout (timer);
    callback (true);
  };
  timer = setTimeout (function () {
    callback (false);
  }, timeout);
  img.src = url;
};

let getDefaultThumbnail = function (category) {
  let catThumb = category ? category.topic_list_default_thumbnail : false;
  let defaultThumbnail = catThumb || settings.topic_list_default_thumbnail;
  return defaultThumbnail ? defaultThumbnail : false;
};

var buttonHTML = function (action) {
  action = action || {};

  var html = "<button class='list-button " + action.class + "'";
  if (action.title) {
    html += 'title="' + I18n.t (action.title) + '"';
  }
  if (action.disabled) {
    html += ' disabled';
  }
  html += `>${iconHTML (action.icon)}`;
  html += '</button>';
  return html;
};

var animateHeart = function ($elem, start, end, complete) {
  if (Ember.testing) {
    return Ember.run (this, complete);
  }

  $elem.stop ().css ('textIndent', start).animate (
    {textIndent: end},
    {
      complete,
      step (now) {
        $ (this).css ('transform', 'scale(' + now + ')');
      },
      duration: 150,
    },
    'linear'
  );
};

const featuredImagesEnabled = function (category = null, isTopic = false) {
  if (isTopic && !settings.topic_list_featured_images_topic) {
    return false;
  }
  if (!category || settings.topic_list_featured_images_category) {
    return settings.topic_list_featured_images;
  } else {
    return category.topic_list_featured_images;
  }
};

export {
  renderUnboundPreview,
  testImageUrl,
  buttonHTML,
  animateHeart,
  featuredImagesEnabled,
  getDefaultThumbnail,
};
