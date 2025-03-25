import puppeteer, { Browser } from "puppeteer"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Default configuration
const DEFAULT_CONFIG: LoadTestConfig = {
  concurrentUsers: 2,
  headless: true,
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

interface TimingMetrics {
  navigationStart: number
  navigationEnd: number
  fileUploadStart: number
  fileUploadEnd: number
  urlInputStart: number
  urlInputEnd: number
  formSubmitStart: number
  formSubmitEnd: number
  processingStart: number
  processingEnd: number
  totalDuration: number
}

async function simulateUser(
  browser: Browser,
  userData: UserSimulation,
  dirs: ReturnType<typeof createRunDirectory>,
  config: LoadTestConfig
): Promise<TimingMetrics> {
  const page = await browser.newPage()
  const metrics: TimingMetrics = {
    navigationStart: 0,
    navigationEnd: 0,
    fileUploadStart: 0,
    fileUploadEnd: 0,
    urlInputStart: 0,
    urlInputEnd: 0,
    formSubmitStart: 0,
    formSubmitEnd: 0,
    processingStart: 0,
    processingEnd: 0,
    totalDuration: 0,
  }

  const simulationStart = Date.now()

  try {
    console.log(`${userData.userId}: Starting simulation`)
    console.log(`${userData.userId}: Using PDF: ${userData.pdfPath}`)
    console.log(`${userData.userId}: Using URL: ${userData.url}`)

    // Navigate to your application
    metrics.navigationStart = Date.now()
    console.log(
      `${userData.userId}: Navigation started at ${new Date(metrics.navigationStart).toISOString()}`
    )
    await page.goto(config.baseUrl)
    metrics.navigationEnd = Date.now()
    console.log(
      `${userData.userId}: Navigation completed in ${metrics.navigationEnd - metrics.navigationStart}ms`
    )

    // Wait for the file input to be available
    await page.waitForSelector('input[type="file"]')

    // Upload PDF file
    metrics.fileUploadStart = Date.now()
    console.log(
      `${userData.userId}: File upload started at ${new Date(metrics.fileUploadStart).toISOString()}`
    )
    const fileInput = await page.$('input[type="file"]')
    if (fileInput) {
      await fileInput.uploadFile(userData.pdfPath)
    }
    metrics.fileUploadEnd = Date.now()
    console.log(
      `${userData.userId}: File upload completed in ${metrics.fileUploadEnd - metrics.fileUploadStart}ms`
    )

    // Fill in URL input
    metrics.urlInputStart = Date.now()
    console.log(
      `${userData.userId}: URL input started at ${new Date(metrics.urlInputStart).toISOString()}`
    )
    await page.type(".form-input.input-url input", userData.url)
    metrics.urlInputEnd = Date.now()
    console.log(
      `${userData.userId}: URL input completed in ${metrics.urlInputEnd - metrics.urlInputStart}ms`
    )

    // Submit the form
    metrics.formSubmitStart = Date.now()
    console.log(
      `${userData.userId}: Form submission started at ${new Date(metrics.formSubmitStart).toISOString()}`
    )
    await page.click('button[type="submit"]')
    metrics.formSubmitEnd = Date.now()
    console.log(
      `${userData.userId}: Form submission completed in ${metrics.formSubmitEnd - metrics.formSubmitStart}ms`
    )

    // Wait for upload to complete - adjust selector based on your UI
    metrics.processingStart = Date.now()
    console.log(
      `${userData.userId}: Processing started at ${new Date(metrics.processingStart).toISOString()}`
    )
    await page.waitForSelector(".upload-success", { timeout: 100000 })
    metrics.processingEnd = Date.now()
    console.log(
      `${userData.userId}: Processing completed in ${metrics.processingEnd - metrics.processingStart}ms`
    )

    metrics.totalDuration = Date.now() - simulationStart
    console.log(
      `${userData.userId}: Simulation completed successfully in ${metrics.totalDuration}ms`
    )
  } catch (error) {
    console.error(`${userData.userId}: Error during simulation:`, error)
    // Take screenshot on error and save to screenshots directory
    await page.screenshot({
      path: join(dirs.screenshotsDir, `error-${userData.userId}-${Date.now()}.png`),
      fullPage: true,
    })

    metrics.totalDuration = Date.now() - simulationStart
    console.log(`${userData.userId}: Simulation failed after ${metrics.totalDuration}ms`)
  } finally {
    await page.close()
    return metrics
  }
}

// Sample job URLs for testing - always ensure we have at least 2 URLs
const JOB_URLS = ["https://universegroup.recruitee.com/o/remote-2d-motion-designer-2-5"]

// Generate users based on the desired count, always mixing between the URLs
const generateUsers = (count: number): UserSimulation[] => {
  return Array.from({ length: count }, (_, index) => ({
    userId: `user${index + 1}`,
    pdfPath: join(__dirname, "../../test-files/sample-1.pdf"),
    // Ensure we're cycling through all available URLs
    url: JOB_URLS[0],
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
    // Run all user simulations concurrently and collect metrics
    const metricsResults = await Promise.all(
      users.map((user) => simulateUser(browser, user, dirs, config))
    )

    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    console.log(`\nAll simulations completed in ${duration} seconds`)

    // Calculate average metrics
    const avgMetrics = metricsResults.reduce(
      (acc, metrics) => {
        Object.keys(metrics).forEach((key) => {
          const typedKey = key as keyof TimingMetrics
          if (typedKey !== "totalDuration") {
            // For timing pairs, calculate the duration
            if (typedKey.endsWith("End")) {
              const startKey = typedKey.replace("End", "Start") as keyof TimingMetrics
              const duration = metrics[typedKey] - metrics[startKey]
              const durationKey = `avg${typedKey.replace("End", "Duration")}` as keyof typeof acc
              // @ts-ignore - Dynamic key assignment
              acc[durationKey] = (acc[durationKey] || 0) + duration / metricsResults.length
            }
          } else {
            // For total duration
            // @ts-ignore - Dynamic key assignment
            acc[typedKey] = (acc[typedKey] || 0) + metrics[typedKey] / metricsResults.length
          }
        })
        return acc
      },
      {} as Record<string, number>
    )

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
          metrics: {
            individual: metricsResults,
            average: avgMetrics,
          },
        },
        null,
        2
      )
    )

    console.log("\nAverage timing metrics:")
    Object.entries(avgMetrics).forEach(([key, value]) => {
      console.log(`${key}: ${value.toFixed(2)}ms`)
    })
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
  concurrentUsers: DEFAULT_CONFIG.concurrentUsers,
  headless: DEFAULT_CONFIG.headless,
  baseUrl: DEFAULT_CONFIG.baseUrl,
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
