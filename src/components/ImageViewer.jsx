export function ImageViewer({ src, alt, onClose }) {
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = src
    a.download = `${alt || 'photo'}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="image-viewer">
        <img src={src} alt={alt || '照片'} onClick={onClose} />
        <div className="image-viewer-actions">
          <button className="secondary-btn" onClick={handleDownload}>💾 保存图片</button>
          <button className="text-btn" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  )
}
