
import { useState, useEffect, useRef } from 'react';

interface ComboBoxOption {
  value: string;
  label: string;
  icon?: string;
}

interface ComboBoxProps {
  options: ComboBoxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

const ComboBox = ({
  options,
  value = '',
  onChange,
  placeholder = 'Select an option...',
  label,
  disabled = false,
  className = '',
  error
}: ComboBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<ComboBoxOption[]>(options);
  const [selectedLabel, setSelectedLabel] = useState('');
  const comboBoxRef = useRef<HTMLDivElement>(null);

  // Update filtered options when search term or options change
  useEffect(() => {
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  // Update selected label when value changes
  useEffect(() => {
    const selected = options.find(option => option.value === value);
    setSelectedLabel(selected ? selected.label : '');
  }, [value, options]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboBoxRef.current && !comboBoxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: ComboBoxOption) => {
    onChange?.(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`combobox-container w-full ${className}`} ref={comboBoxRef}>
      {label && (
        <label className="combobox-label block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            className={`w-full pl-4 pr-10 py-3 border-2 rounded-lg duration-200 bg-white font-medium ${
              disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-blue-400 cursor-text'
            } ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} ${
              isOpen ? 'border-blue-500 shadow-lg ring-4 ring-blue-100' : 'shadow-sm'
            } focus:outline-none`}
            placeholder={selectedLabel && !searchTerm ? '' : placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onClick={handleInputClick}
            disabled={disabled}
          />
          {selectedLabel && !searchTerm && (
            <div 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 pointer-events-none"
            >
              {(() => {
                const selected = options.find(opt => opt.value === value);
                return selected?.icon ? (
                  <img 
                    src={selected.icon} 
                    alt="" 
                    className="w-6 h-5 object-cover rounded shadow-sm border border-gray-200 shrink-0" 
                  />
                ) : null;
              })()}
              <span className="text-gray-800 font-medium">{selectedLabel}</span>
            </div>
          )}
          <div 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={handleToggle}
          >
            <svg
              className={`w-5 h-5 shrink-0 transition-all duration-300 ${
                isOpen ? 'transform rotate-180 text-blue-500' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-blue-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="overflow-y-auto max-h-64 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                <div className="py-1">
                  {filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      className={`px-4 py-3 cursor-pointer transition-all duration-150 flex items-center gap-3 group ${
                        option.value === value 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'hover:bg-blue-50'
                      } ${index !== 0 ? 'border-t border-gray-50' : ''}`}
                      onClick={() => handleSelect(option)}
                    >
                      {option.icon && (
                        <img 
                          src={option.icon} 
                          alt="" 
                          className={`w-7 h-5 object-cover rounded shadow-sm border shrink-0 ${
                            option.value === value ? 'border-white' : 'border-gray-200'
                          }`} 
                        />
                      )}
                      <span className={`font-medium text-sm flex-1 ${
                        option.value === value ? 'text-white' : 'text-gray-700 group-hover:text-blue-600'
                      }`}>
                        {option.label}
                      </span>
                      {option.value === value && (
                        <svg className="w-5 h-5 text-white shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-gray-400 text-center">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">No countries found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-600">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ComboBox;