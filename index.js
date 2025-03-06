//server stuffs
import express from "express";
const app = express();
app.use(express.static("public")); //where our static stylin' stuffs be
const port = 3000;
app.listen(port, () => {
    console.log(`Server's up! Listening on port ${port}`);
})
app.get("/", (req, res) =>{ //on first visit to the site, the homepage
    res.render("index.ejs");
})

//body-parser stuffs
import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: true }));

//web-scrapin' google images stuffs
import puppeteer from "puppeteer";
async function googleImageSearch(searchQuery) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // set a user agent so Google doesn't display a "basic" version for automation
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36"
  );

  // go to google images homepage
  await page.goto("https://www.google.com/imghp", {
    waitUntil: "domcontentloaded",
  });

  // wait for search box
  await page.waitForSelector("textarea");
  // Click inside search box
  await page.click("textarea");

  // type query
  await page.type("textarea", searchQuery);

  // press Enter
  await page.keyboard.press("Enter");

  // wait for the images results page to load
  await page.waitForNavigation();

  const thumbnailSelector =
    "#rso > div > div > div:first-of-type > div:first-of-type > div:first-of-type > div:first-of-type > div:nth-of-type(2) img";
  await page.waitForSelector(thumbnailSelector);
  await page.click(thumbnailSelector);

  await page.waitForSelector("#Sva75c");

  const fullImageSelector = "#Sva75c img.sFlh5c.FyHeAf.iPVvYb";
  await page.waitForSelector(fullImageSelector);

  // Retrieve the 'src' attribute of the full-sized image
  const imageSrc = await page.evaluate((sel) => {
    const img = document.querySelector(sel);
    return img ? img.src : null;
  }, fullImageSelector);

  console.log("Image Source:", imageSrc);
  await browser.close();
  return imageSrc;
}
// Example usage
//googleImageSearch("puppy");

//api retrieval stuffs
import axios from "axios";
app.post('/decode', async (req, res) => {
    const { vin } = req.body;
    const apiUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`;
    try {
      const response = await axios.get(apiUrl);
      const results = response.data.Results;
      
      //basic info
      let make, model, year, trim;
      
      //additional info
      let vehicleType, driveType, doors, cylinders, engineSize, fuelType, 
          transmission, manufacturer, plantCountry, bodyClass, gvwr;
      
      results.forEach(item => {
        switch(item.Variable) {
          case 'Make':
            make = item.Value;
            break;
          case 'Model':
            model = item.Value;
            break;
          case 'Model Year':
            year = item.Value;
            break;
          case 'Trim':
            trim = item.Value;
            break;
          case 'Vehicle Type':
            vehicleType = item.Value;
            break;
          case 'Drive Type':
            driveType = item.Value;
            break;
          case 'Doors':
            doors = item.Value;
            break;
          case 'Engine Number of Cylinders':
            cylinders = item.Value;
            break;
          case 'Displacement (L)':
            engineSize = item.Value;
            break;
          case 'Fuel Type - Primary':
            fuelType = item.Value;
            break;
          case 'Transmission Style':
            transmission = item.Value;
            break;
          case 'Manufacturer Name':
            manufacturer = item.Value;
            break;
          case 'Plant Country':
            plantCountry = item.Value;
            break;
          case 'Body Class':
            bodyClass = item.Value;
            break;
          case 'GVWR Range Class':
            gvwr = item.Value;
            break;
        }
      });
      
      const carImgSrc = await googleImageSearch(`${make} ${model} ${year} ${trim}`);
      
      res.render('index.ejs', { 
        Make: make, 
        Model: model, 
        Year: year, 
        Trim: trim, 
        ImageUrl: carImgSrc,
        //additional specs for the collapsible section
        VehicleType: vehicleType,
        DriveType: driveType,
        Doors: doors,
        Cylinders: cylinders,
        EngineSize: engineSize,
        FuelType: fuelType,
        Transmission: transmission,
        Manufacturer: manufacturer,
        PlantCountry: plantCountry,
        BodyClass: bodyClass,
        GVWR: gvwr
      });
    } catch (error) {
        console.error('Error decoding VIN:', error);
        res.render('index.ejs', { 
          Make: null, Model: null, Year: null, Trim: null, ImageUrl: null,
          VehicleType: null, DriveType: null, Doors: null, Cylinders: null,
          EngineSize: null, FuelType: null, Transmission: null, Manufacturer: null,
          PlantCountry: null, BodyClass: null, GVWR: null
        });
      }
  });