import { useState } from 'react'
import ConverterScreen from './components/ConverterScreen.jsx'
import ConfirmationScreen from './components/ConfirmationScreen.jsx'
import QuoteDetailsScreen from './components/QuoteDetailsScreen.jsx'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('converter')
  const [transactionData, setTransactionData] = useState(null)

  const handleConversionSuccess = (data) => {
    setTransactionData(data)
    setCurrentScreen('quoteDetails')
  }

  const handleBackToConverter = () => {
    setCurrentScreen('converter')
    setTransactionData(null)
  }

  const handleProceedToConfirmation = () => {
    setCurrentScreen('confirmation')
  }

  return (
    <div className="App">
      {currentScreen === 'converter' && (
        <ConverterScreen onSuccess={handleConversionSuccess} />
      )}
      
      {currentScreen === 'quoteDetails' && (
        <QuoteDetailsScreen 
          transactionData={transactionData}
          onBack={handleBackToConverter}
          onProceed={handleProceedToConfirmation}
        />
      )}
      
      {currentScreen === 'confirmation' && (
        <ConfirmationScreen 
          transactionData={transactionData}
          onBack={handleBackToConverter}
        />
      )}
    </div>
  )
}

export default App

