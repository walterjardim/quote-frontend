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
  className = ""
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
          className={cn(
            "w-full justify-between bg-white hover:bg-gray-50",
            className
          )}
        >
          {selectedCurrency ? (
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center text-xs text-white",
                selectedCurrency.color || "bg-gray-500"
              )}>
                {selectedCurrency.category === 'fiat' ?
                  selectedCurrency.flag :
                  selectedCurrency.icon
                }
              </div>
              <span className="font-medium">
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
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Procurar Moedas"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <CommandList className="max-h-80">
            <CommandEmpty>Nenhuma moeda encontrada.</CommandEmpty>

            {/* Categoria Fiat */}
            {filteredFiatCurrencies.length > 0 && (
              <CommandGroup heading="Fiat">
                {filteredFiatCurrencies.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={currency.code}
                    onSelect={() => handleSelect(currency.code)}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-sm",
                      currency.color
                    )}>
                      {currency.flag}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{currency.code}</span>
                        <span className="text-gray-500 text-sm">|</span>
                        <span className="text-gray-600 text-sm">{currency.name}</span>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === currency.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Categoria Crypto */}
            {filteredCryptoCurrencies.length > 0 && (
              <CommandGroup heading="Crypto">
                {filteredCryptoCurrencies.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={currency.code}
                    onSelect={() => handleSelect(currency.code)}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-sm text-white",
                      currency.color
                    )}>
                      {currency.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{currency.name}</span>
                        <span className="text-gray-500 text-sm">|</span>
                        <span className="text-gray-600 text-sm">{currency.description}</span>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
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
