// Core viewer
import { Viewer, Worker } from '@react-pdf-viewer/core'

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { useState } from 'react'
interface PDFViewerProps {
  url: string
  onLastPage: () => void
}
// Create new plugin instance
export function PDFViewer({ url, onLastPage }: PDFViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const [numPages, setNumPages] = useState(0)

  const handleDocumentLoad = (e: any) => {
    setNumPages(e.doc.numPages)
  }

  const handlePageChange = (e: any) => {
    if (e.currentPage + 1 === numPages) {
      onLastPage()
    }
  }

  return (
    <Worker workerUrl='https://unpkg.com/pdfjs-dist@4.3.136/build/pdf.worker.mjs'>
      <Viewer
        fileUrl={url}
        plugins={[defaultLayoutPluginInstance]}
        onDocumentLoad={handleDocumentLoad}
        onPageChange={handlePageChange}
      />
    </Worker>
  )
}
