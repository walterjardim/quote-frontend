import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.jsx'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command.jsx'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils.js'
import { CURRENCIES } from '../data/currencies.js'

export default function CurrencySelector({
  value,
  onValueChange,
  placeholder = "Selecionar moeda...",
  className = "",
  disabled = false
}) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const selectedCurrency = value ?
    [...CURRENCIES.fiat, ...CURRENCIES.crypto].find(currency => currency.code === value) :
    null

  const filteredFiatCurrencies = CURRENCIES.fiat.filter(currency =>
    currency.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchValue.toLowerCase()) ||
    currency.fullName.toLowerCase().includes(searchValue.toLowerCase())
  )

  const filteredCryptoCurrencies = CURRENCIES.crypto.filter(currency =>
    currency.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchValue.toLowerCase()) ||
    currency.description.toLowerCase().includes(searchValue.toLowerCase()) ||
    currency.fullName.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleSelect = (currencyCode) => {
    console.log('selectedCurrency = ', selectedCurrency);
    onValueChange(currencyCode)
    setOpen(false)
    setSearchValue("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            "bg-secondary/50 hover:bg-secondary/70 border-border",
            "text-foreground hover:text-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          {selectedCurrency ? (
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center text-xs",
                selectedCurrency.category === 'fiat' ? "text-black" : "text-white",
                selectedCurrency.color || "bg-gray-500"
              )}>
                {selectedCurrency.category === 'fiat' ?
                  selectedCurrency.flag :
                  selectedCurrency.icon
                }
              </div>
              <span className="font-medium text-foreground">
                {selectedCurrency.category === 'fiat' ?
                  selectedCurrency.code :
                  selectedCurrency.name
                }
              </span>
              {selectedCurrency.category === 'fiat' && (
                <span className="text-muted-foreground">
                  ({selectedCurrency.network || selectedCurrency.name})
                </span>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-popover border-border" align="start">
        <Command className="bg-popover">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-muted-foreground" />
            <Input
              placeholder="Procurar Moedas"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <CommandList className="max-h-80">
            <CommandEmpty className="text-muted-foreground py-6 text-center text-sm">
              Nenhuma moeda encontrada.
            </CommandEmpty>

            {/* Categoria Fiat */}
            {filteredFiatCurrencies.length > 0 && (
              <CommandGroup heading="Fiat" className="text-muted-foreground">
                {filteredFiatCurrencies.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={currency.code}
                    onSelect={() => handleSelect(currency.code)}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-foreground"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-sm",
                      currency.color
                    )}>
                      {currency.flag}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">{currency.code}</span>
                        <span className="text-muted-foreground text-sm">|</span>
                        <span className="text-muted-foreground text-sm">{currency.name}</span>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4 text-primary",
                        value === currency.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Categoria Crypto */}
            {filteredCryptoCurrencies.length > 0 && (
              <CommandGroup heading="Crypto" className="text-muted-foreground">
                {filteredCryptoCurrencies.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={currency.code}
                    onSelect={() => handleSelect(currency.code)}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-foreground"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-sm text-white",
                      currency.color
                    )}>
                      {currency.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">{currency.name}</span>
                        <span className="text-muted-foreground text-sm">|</span>
                        <span className="text-muted-foreground text-sm">{currency.description}</span>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4 text-primary",
                        value === currency.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

