import { useState } from 'react'
import DocumentUploadScreen from './components/DocumentUploadScreen.jsx'
import ConverterScreen from './components/ConverterScreen.jsx'
import ConfirmationScreen from './components/ConfirmationScreen.jsx'
import QuoteDetailsScreen from './components/QuoteDetailsScreen.jsx'
import './App.css'
import { useTimer } from "./components/Timer.jsx"

function App() {
  const [currentScreen, setCurrentScreen] = useState('documentUpload')
  const [documentId, setDocumentId] = useState(null)
  const [transactionData, setTransactionData] = useState(null)
  const timer = useTimer(175)

  const handleDocumentUploadSuccess = (uploadedDocumentId) => {
    setDocumentId(uploadedDocumentId)
    setCurrentScreen('converter')
  }

  const handleConversionSuccess = (data) => {
    setTransactionData(data)
    setCurrentScreen('quoteDetails')
  }

  const handleBackToConverter = () => {
    setCurrentScreen('converter')
    setTransactionData(null)
  }

  const handleBackToDocumentUpload = () => {
    setCurrentScreen('documentUpload')
    setDocumentId(null)
    setTransactionData(null)
  }

  const handleProceedToConfirmation = () => {
    setCurrentScreen('confirmation')
  }

  return (
    <div className="App">
      {currentScreen === 'documentUpload' && (
        <DocumentUploadScreen onSuccess={handleDocumentUploadSuccess} />
      )}

      {currentScreen === 'converter' && (
        <ConverterScreen
          documentId={documentId}
          onSuccess={handleConversionSuccess}
          onBack={handleBackToDocumentUpload}
          timer={timer}
        />
      )}

      {currentScreen === 'quoteDetails' && (
        <QuoteDetailsScreen
          transactionData={transactionData}
          documentId={documentId}
          onBack={handleBackToConverter}
          onProceed={handleProceedToConfirmation}
          timer={timer}
        />
      )}

      {currentScreen === 'confirmation' && (
        <ConfirmationScreen
          transactionData={transactionData}
          documentId={documentId}
          onBack={handleBackToDocumentUpload}
        />
      )}
    </div>
  )
}

export default App
