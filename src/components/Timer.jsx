import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { TIMER_CONFIG } from '../config/environment.js'

export default function Timer({ 
  initialSeconds = TIMER_CONFIG.duration, 
  onExpire, 
  className = "",
  showIcon = true,
  size = "default" 
}) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    let interval = null
    
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => {
          if (seconds <= 1) {
            setIsActive(false)
            if (onExpire) {
              onExpire()
            }
            return 0
          }
          return seconds - 1
        })
      }, 1000)
    } else if (seconds === 0) {
      setIsActive(false)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isActive, seconds, onExpire])

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    return ((initialSeconds - seconds) / initialSeconds) * 100
  }

  const getColorClass = () => {
    if (seconds <= 30) return 'text-red-500'
    if (seconds <= 60) return 'text-orange-500'
    return 'text-green-500'
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-sm'
      case 'large':
        return 'text-2xl font-bold'
      case 'xlarge':
        return 'text-4xl font-bold'
      default:
        return 'text-lg font-semibold'
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <Clock className={`w-4 h-4 ${getColorClass()}`} />
      )}
      <div className="flex flex-col items-center">
        <span className={`${getSizeClasses()} ${getColorClass()} font-mono`}>
          {formatTime(seconds)}
        </span>
        {size === 'large' || size === 'xlarge' ? (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                seconds <= 30 ? 'bg-red-500' : 
                seconds <= 60 ? 'bg-orange-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${100 - getProgressPercentage()}%` }}
            />
          </div>
        ) : null}
        {seconds === 0 && (
          <span className="text-xs text-red-500 mt-1">
            Tempo expirado
          </span>
        )}
      </div>
    </div>
  )
}

// Hook personalizado para usar o timer
export function useTimer(initialSeconds = 175) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(false)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    let interval = null
    
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => {
          if (seconds <= 1) {
            setIsActive(false)
            setIsExpired(true)
            return 0
          }
          return seconds - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isActive, seconds])

  const startTimer = () => {
    setIsActive(true)
    setIsExpired(false)
  }

  const stopTimer = () => {
    setIsActive(false)
  }

  const resetTimer = (newSeconds = initialSeconds) => {
    setSeconds(newSeconds)
    setIsActive(false)
    setIsExpired(false)
  }

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return {
    seconds,
    isActive,
    isExpired,
    formattedTime: formatTime(seconds),
    startTimer,
    stopTimer,
    resetTimer
  }
}

