import { useState } from 'react'
import ConverterScreen from './components/ConverterScreen.jsx'
import ConfirmationScreen from './components/ConfirmationScreen.jsx'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('converter')
  const [transactionData, setTransactionData] = useState(null)

  const handleConversionSuccess = (data) => {
    setTransactionData(data)
    setCurrentScreen('confirmation')
  }

  const handleBackToConverter = () => {
    setCurrentScreen('converter')
    setTransactionData(null)
  }

  return (
    <div className="App">
      {currentScreen === 'converter' && (
        <ConverterScreen onSuccess={handleConversionSuccess} />
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

