import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import API from "../api/api"

export default function Dashboard() {
  const [media, setMedia] = useState([])
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)

  const token = localStorage.getItem("token")

  /**
   * Fetch media (memoized for stability)
   */
  const fetchMedia = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const res = await API.get("/media", {
        headers: { Authorization: token },
      })
      setMedia(res.data)
    } catch (err) {
      console.error(err)
      setError("Failed to load gallery.")
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  /**
   * Upload Handler
   */
  const handleUpload = async () => {
    if (!file) return setError("Please select a file.")

    const formData = new FormData()
    formData.append("file", file)

    try {
      setUploading(true)
      await API.post("/upload", formData, {
        headers: { Authorization: token },
      })
      setFile(null)
      fetchMedia()
    } catch (err) {
      console.error(err)
      setError("Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  /**
   * Delete Handler
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this memory permanently?")) return

    try {
      await API.delete(`/media/${id}`, {
        headers: { Authorization: token },
      })
      fetchMedia()
      setSelectedMedia(null)
    } catch (err) {
      console.error(err)
      setError("Failed to delete.")
    }
  }

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedMedia(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    // Full page container - fills entire viewport
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-violet-900">
      {/* Neon glow effects - fixed positioned */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-64 h-64 md:w-96 md:h-96 bg-cyan-500 rounded-full opacity-30 blur-[100px] md:blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 md:w-96 md:h-96 bg-violet-500 rounded-full opacity-30 blur-[100px] md:blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[600px] md:h-[600px] bg-blue-600 rounded-full opacity-15 blur-[120px] md:blur-[150px]" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-6 px-4 md:py-8 text-center"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wide drop-shadow-lg">
            Past Memories
          </h1>
          <p className="text-cyan-200/60 mt-1 md:mt-2 text-sm md:text-base">
            Your personal collection of moments
          </p>
        </motion.header>

        {/* Upload Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-4 md:mx-6 lg:mx-auto max-w-4xl bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 mb-6"
        >
          <div className="flex flex-col gap-4">
            {/* File Input - Full width on mobile */}
            <div className="w-full">
              <label className="block">
                <span className="sr-only">Choose media file</span>
                <input
                  type="file"
                  aria-label="Upload memory file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept="image/*,video/*"
                  className="block w-full text-sm text-cyan-200
                    file:mr-0 md:file:mr-4 file:py-2 file:px-3 md:file:px-4
                    file:rounded-lg md:file:rounded-xl file:border-0
                    file:text-xs md:file:text-sm file:font-semibold
                    file:bg-cyan-500/20 file:text-cyan-300
                    file:border file:border-cyan-500/30
                    hover:file:bg-cyan-500/30
                    cursor-pointer
                    bg-gray-800/50 border border-white/10 rounded-xl
                    p-2 md:p-2 transition-all duration-200"
                />
              </label>
              {file && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-cyan-300 text-xs md:text-sm mt-2 truncate"
                >
                  Selected: {file.name}
                </motion.p>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`
                w-full md:w-auto px-6 py-3 rounded-xl font-semibold text-white
                transition-all duration-200 transform whitespace-nowrap
                ${!file || uploading
                  ? "bg-gray-600 cursor-not-allowed" 
                  : "bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 hover:from-cyan-400 hover:via-blue-400 hover:to-violet-400 hover:scale-[1.02] active:scale-[0.97] shadow-lg hover:shadow-cyan-500/25"
                }
              `}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload Memory"
              )}
            </button>
          </div>
        </motion.section>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-4 md:mx-6 lg:mx-auto max-w-4xl bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-4 text-center text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area - Flexible to fill space */}
        <div className="flex-1 px-4 md:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 md:py-24"
              >
                <div className="inline-block">
                  <svg className="animate-spin h-10 w-10 md:h-12 md:w-12 text-cyan-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <p className="text-cyan-200/60 mt-4">Loading memories...</p>
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && media.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 md:py-24"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-cyan-500/20 mb-4">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-cyan-200/60 text-base md:text-lg">No memories yet...</p>
                <p className="text-cyan-200/40 text-sm mt-2">Upload your first memory above</p>
              </motion.div>
            )}

            {/* Gallery Grid - Responsive masonry */}
            {!loading && media.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {/* Responsive columns: 1 on mobile, 2 on tablet, 3 on laptop, 4 on desktop */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
                  <AnimatePresence>
                    {media.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="break-inside-avoid"
                      >
                        <div 
                          onClick={() => setSelectedMedia(item)}
                          className="group cursor-pointer bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                        >
                          {/* Media */}
                          <div className="relative overflow-hidden">
                            {item.type === "image" ? (
                              <img
                                src={item.url}
                                alt="User memory"
                                loading="lazy"
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <video
                                src={item.url}
                                controls
                                className="w-full h-auto object-cover"
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                            
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* View icon on hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-full">
                                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 rounded-full bg-gray-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/50 z-10"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(item._id)
                            }}
                            aria-label="Delete memory"
                          >
                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="py-4 text-center text-cyan-200/30 text-xs md:text-sm">
          <p>Made with 💜</p>
        </footer>
      </main>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedMedia(null)}
          >
            {/* Close button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-3 right-3 md:top-4 md:right-4 p-2 md:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              onClick={() => setSelectedMedia(null)}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Delete button in modal */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-3 right-16 md:right-20 p-2 md:p-3 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(selectedMedia._id)
              }}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>

            {/* Media content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-full max-h-[85vh] md:max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.url}
                  alt="User memory"
                  className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-xl md:rounded-2xl shadow-2xl"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[70vh] md:max-h-[80vh] rounded-xl md:rounded-2xl shadow-2xl"
                />
              )}
              
              {/* Date info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-gray-900/90 to-transparent rounded-b-xl md:rounded-b-2xl">
                <p className="text-cyan-200 text-xs md:text-sm text-center">
                  {new Date(selectedMedia.createdAt || Date.now()).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
