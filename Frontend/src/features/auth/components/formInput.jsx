import React from 'react'
import '../style/formInput.scss'

const FormInput = ({ 
  label, 
  error,
  required = false,
  ...props  
}) => {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

     
      <input
        {...props}
        className={`form-input ${error ? 'input-error' : ''}`}
      />

      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default FormInput