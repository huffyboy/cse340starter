const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  // console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = ''
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += `<li>
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
        </div>
      </li>`
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the inventory view HTML
* ************************************ */
Util.buildVehiclePage = async function(data) {
  if (data && data.length > 0) {
    const vehicle = data[0];
    let formattedMiles = vehicle.inv_miles.toLocaleString('en-US');
    let formattedPrice = '$' + Number(vehicle.inv_price).toLocaleString('en-US');
    let page = `
    <div id="vehicle-details">
      <div id='vehicle-image'>
        <img src='${vehicle.inv_image}' alt='Full image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors' />
      </div>
      <div id='vehicle-content'>
        <ul>
          <li><span>Year: </span>${vehicle.inv_year}</li>
          <li><span>Color: </span>${vehicle.inv_color}</li>
          <li><span>Miles: </span>${formattedMiles}</li>
        </ul>
        <h1 class='price'>${formattedPrice}</h1>
        <p class='description'>${vehicle.inv_description}</p>
      </div>
    </div>
    `;
    return page;
  } else {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList = '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value='' disabled selected>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

Util.getImages = function (filterCondition) {
  const fs = require("fs");
  const path = require("path");
  const imagePath = path.join(__dirname, "..", "public", "images", "vehicles");

  return new Promise((resolve, reject) => {
    fs.readdir(imagePath, (err, files) => {
      if (err) {
        return reject(err);
      }

      // Filter files based on the provided condition
      const imageFiles = files.filter(filterCondition);
      resolve(imageFiles);
    });
  });
};

Util.getVehicleImages = async function () {
  return Util.getImages(
    (file) => /\.(jpg|jpeg|png|gif)$/i.test(file) && !/tn\.(jpg|jpeg|png|gif)$/i.test(file)
  );
};

Util.getVehicleThumbnailImages = async function () {
  return Util.getImages((file) => /tn\.(jpg|jpeg|png|gif)$/i.test(file));
};

Util.buildImageList = async function (thumbnailOnly = false, imageFile = null) {
  let defaultOption = imageFile ? imageFile : (
    thumbnailOnly ? "/images/vehicles/no-image-tn.png" : "/images/vehicles/no-image.png"
  );
  let data = thumbnailOnly ? await Util.getVehicleThumbnailImages() : await Util.getVehicleImages();

  let imageList = `
<select name="${thumbnailOnly ? "inv_thumbnail" : "inv_image"}" id="${thumbnailOnly ? "thumbnailList" : "imageList"}" required>
  <option value="" disabled>Select an image...</option>`

  data.forEach((file) => {
    imageList += `
  <option value="/images/vehicles/${file}" ${"/images/vehicles/" + file == defaultOption ? "selected" : ""}>
    ${file}
  </option>`;
  });

  imageList += `
</select>
<div class="image-preview">
    <img id="${thumbnailOnly ? "thumbnailPreview" : "imagePreview"}"
      src="${defaultOption}"
      alt="${thumbnailOnly ? "Thumbnail" : "Image"} selected in the dropdown">
</div>
`;

  return imageList;
}

Util.decodeHTMLEntities = function (text) {
  const entities = {
    '&#x2F;': '/',
  };
  return text.replace(/&#x[0-9A-Fa-f]+;/g, match => entities[match] || match);
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util