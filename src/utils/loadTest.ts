import puppeteer, { Browser } from "puppeteer"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface UserSimulation {
  userId: string
  pdfPath: string
  url: string
}

async function simulateUser(browser: Browser, userData: UserSimulation): Promise<void> {
  const page = await browser.newPage()

  try {
    console.log(`${userData.userId}: Starting simulation`)

    // Navigate to your application
    await page.goto("http://localhost:3001") // Adjust URL to match your dev server

    // Wait for the file input to be available
    await page.waitForSelector('input[type="file"]')

    // Upload PDF file
    const fileInput = await page.$('input[type="file"]')
    if (fileInput) {
      await fileInput.uploadFile(userData.pdfPath)
    }

    // Fill in URL input
    await page.type('input[type="url"]', userData.url)

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for upload to complete - adjust selector based on your UI
    await page.waitForSelector(".upload-success", { timeout: 30000 })

    console.log(`${userData.userId}: Simulation completed successfully`)
  } catch (error) {
    console.error(`${userData.userId}: Error during simulation:`, error)
    // Take screenshot on error
    await page.screenshot({
      path: `error-${userData.userId}-${Date.now()}.png`,
      fullPage: true,
    })
  } finally {
    await page.close()
  }
}

async function runLoadTest() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true in production
    defaultViewport: { width: 1280, height: 800 },
  })

  const users: UserSimulation[] = [
    {
      userId: "user1",
      pdfPath: join(__dirname, "../../test-files/sample-1.pdf"),
      url: "https://example1.com",
    },
    {
      userId: "user2",
      pdfPath: join(__dirname, "../../test-files/sample-1.pdf"),
      url: "https://example2.com",
    },
  ]

  console.log("Starting concurrent browser simulations...")
  const startTime = Date.now()

  try {
    // Run all user simulations concurrently
    await Promise.all(users.map((user) => simulateUser(browser, user)))

    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    console.log(`\nAll simulations completed in ${duration} seconds`)
  } catch (error) {
    console.error("Test failed:", error)
  } finally {
    await browser.close()
  }
}

// Add error handling for the main function
runLoadTest().catch(console.error)
