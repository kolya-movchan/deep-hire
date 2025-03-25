import puppeteer, { Browser } from "puppeteer"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Default configuration
const DEFAULT_CONFIG: LoadTestConfig = {
  concurrentUsers: 5,
  headless: false,
  baseUrl: "http://localhost:3001/",
}

// Create base directories
const UTILS_DIR = join(__dirname)
const RUNS_DIR = join(UTILS_DIR, "runs")

if (!fs.existsSync(RUNS_DIR)) {
  fs.mkdirSync(RUNS_DIR, { recursive: true })
}

// Create a new run directory with timestamp
const createRunDirectory = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const runDir = join(RUNS_DIR, `run-${timestamp}`)
  const screenshotsDir = join(runDir, "screenshots")
  const reportsDir = join(runDir, "reports")

  fs.mkdirSync(runDir)
  fs.mkdirSync(screenshotsDir)
  fs.mkdirSync(reportsDir)

  return {
    runDir,
    screenshotsDir,
    reportsDir,
  }
}

interface UserSimulation {
  userId: string
  pdfPath: string
  url: string
}

interface LoadTestConfig {
  concurrentUsers: number
  headless: boolean
  baseUrl: string
}

async function simulateUser(
  browser: Browser,
  userData: UserSimulation,
  dirs: ReturnType<typeof createRunDirectory>,
  config: LoadTestConfig
): Promise<void> {
  const page = await browser.newPage()

  try {
    console.log(`${userData.userId}: Starting simulation`)

    // Navigate to your application
    await page.goto(config.baseUrl)

    // Wait for the file input to be available
    await page.waitForSelector('input[type="file"]')

    // Upload PDF file
    const fileInput = await page.$('input[type="file"]')
    if (fileInput) {
      await fileInput.uploadFile(userData.pdfPath)
    }

    // Fill in URL input
    await page.type(".form-input.input-url input", userData.url)

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for upload to complete - adjust selector based on your UI
    await page.waitForSelector(".upload-success", { timeout: 100000 })

    console.log(`${userData.userId}: Simulation completed successfully`)
  } catch (error) {
    console.error(`${userData.userId}: Error during simulation:`, error)
    // Take screenshot on error and save to screenshots directory
    await page.screenshot({
      path: join(dirs.screenshotsDir, `error-${userData.userId}-${Date.now()}.png`),
      fullPage: true,
    })
  } finally {
    await page.close()
  }
}

// Sample job URLs for testing - always ensure we have at least 2 URLs
const JOB_URLS = ["https://universegroup.recruitee.com/o/remote-2d-motion-designer-2-5"]

// Generate users based on the desired count, always mixing between the URLs
const generateUsers = (count: number): UserSimulation[] => {
  // Ensure we have at least 2 URLs to mix between
  if (JOB_URLS.length < 2) {
    throw new Error("At least 2 job URLs must be defined for proper testing")
  }

  return Array.from({ length: count }, (_, index) => ({
    userId: `user${index + 1}`,
    pdfPath: join(__dirname, "../../test-files/sample-1.pdf"),
    // Ensure we're cycling through all available URLs
    url: JOB_URLS[index % JOB_URLS.length],
  }))
}

async function runLoadTest(customConfig: Partial<LoadTestConfig> = {}): Promise<void> {
  // Merge default config with custom config
  const config: LoadTestConfig = { ...DEFAULT_CONFIG, ...customConfig }

  console.log(`Starting load test with ${config.concurrentUsers} concurrent users`)
  console.log(`Headless mode: ${config.headless ? "enabled" : "disabled"}`)

  const browser = await puppeteer.launch({
    headless: config.headless,
    defaultViewport: { width: 1280, height: 800 },
  })

  const users = generateUsers(config.concurrentUsers)

  console.log("Starting concurrent browser simulations...")
  const startTime = Date.now()

  // Create directories for this test run
  const dirs = createRunDirectory()

  try {
    // Run all user simulations concurrently
    await Promise.all(users.map((user) => simulateUser(browser, user, dirs, config)))

    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    console.log(`\nAll simulations completed in ${duration} seconds`)

    // Save test results to reports directory
    fs.writeFileSync(
      join(dirs.reportsDir, `test-report.json`),
      JSON.stringify(
        {
          startTime,
          endTime,
          duration,
          usersCount: users.length,
          concurrentUsers: config.concurrentUsers,
          headless: config.headless,
          baseUrl: config.baseUrl,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    )
  } catch (error) {
    console.error("Test failed:", error)
    // Log errors to reports directory
    fs.writeFileSync(
      join(dirs.reportsDir, `test-error.txt`),
      `${new Date().toISOString()}\n${error}\n${error instanceof Error ? error.stack : ""}`
    )
  } finally {
    await browser.close()
  }
}

// Example usage:
// Run with 5 concurrent users in headless mode
runLoadTest({
  concurrentUsers: 5,
  headless: DEFAULT_CONFIG.headless,
  // baseUrl: "https://staging.example.com/" // Uncomment to override default URL
}).catch((error) => {
  console.error("Fatal error:", error)
  // Create error directory if it doesn't exist yet
  const errorDir = join(RUNS_DIR, "fatal-errors")
  if (!fs.existsSync(errorDir)) {
    fs.mkdirSync(errorDir, { recursive: true })
  }
  // Log fatal errors to a separate directory
  fs.writeFileSync(
    join(errorDir, `fatal-error-${Date.now()}.txt`),
    `${new Date().toISOString()}\n${error}\n${error instanceof Error ? error.stack : ""}`
  )
})
