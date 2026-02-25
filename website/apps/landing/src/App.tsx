import React from 'react'

interface App {
  name: string
  description: string
  url: string
}

const PHOTO_SHARING_URL = import.meta.env.VITE_PHOTO_SHARING_URL || 'http://localhost:5174'

const apps: App[] = [
  {
    name: 'Photo Sharing',
    description: 'A simple, Google Photos-like app for sharing images with friends and family. Create albums, upload photos, and share via link.',
    url: PHOTO_SHARING_URL,
  },
  // Add more apps here in the future
]

function App() {
  return (
    <div className="container">
      <header className="hero">
        <h1>Welcome to My Personal Hub</h1>
        <p>
          A collection of personal projects and applications built with modern web technologies.
          Explore the apps below to get started.
        </p>
      </header>

      <section className="apps-section">
        <h2>Available Apps</h2>
        <div className="apps-grid">
          {apps.map((app) => (
            <div key={app.name} className="app-card">
              <h3>{app.name}</h3>
              <p>{app.description}</p>
              <button onClick={() => window.location.href = app.url}>
                Open App
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <p>&copy; {new Date().getFullYear()} Personal Website. Built with AWS Lambda, S3, and CloudFront.</p>
      </footer>
    </div>
  )
}

export default App
