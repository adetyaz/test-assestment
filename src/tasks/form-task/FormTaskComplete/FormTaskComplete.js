import React, { useState } from 'react'
import { options, validationSchema } from '../../utils'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { saveUserForm } from './form-api'

export const FormTaskComplete = () => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		userType: '',
		inactivityDate: null,
		birthday: null,
	})

	const [errors, setErrors] = useState({})
	const [touchedFields, setTouchedFields] = useState({})

	const handleBlur = (field) => {
		setTouchedFields({
			...touchedFields,
			[field]: true,
		})

		validationSchema
			.validateAt(field, formData)
			.then(() => {
				// No error for this field, clear existing error
				setErrors((prevErrors) => ({
					...prevErrors,
					[field]: undefined,
				}))
			})
			.catch((error) => {
				// Validation error for this field, set the error message
				setErrors((prevErrors) => ({
					...prevErrors,
					[field]: error.message,
				}))
			})
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	const handleDateChange = (date, field) => {
		setFormData({
			...formData,
			[field]: date,
		})
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		validationSchema
			.validate(formData, { abortEarly: false })
			.then(() => {
				// Validation successful, handle form submission logic here
				saveUserForm()
				console.log('Form data is valid:', formData)
			})
			.catch((error) => {
				const validationErrors = {}
				error?.inner.forEach((e) => {
					validationErrors[e.path] = e.message
				})
				setErrors(validationErrors)
			})
	}

	return (
		<form className='form-group'>
			<section>
				<h3>Personal Info</h3>
				<div>
					<label htmlFor='firstName'>
						First Name <span>*</span>
					</label>
					<input
						type='text'
						name='firstName'
						placeholder='John'
						data-testid='firstName'
						value={formData.firstName}
						onChange={handleChange}
						onBlur={() => handleBlur('firstName')}
					/>
					{touchedFields.firstName || errors.firstName ? (
						<div className='warning'>{errors.firstName}</div>
					) : null}
				</div>
				<div>
					<label htmlFor='lastName'>
						Last Name <span>*</span>
					</label>
					<input
						type='text'
						name='lastName'
						placeholder='Doe'
						data-testid='lastName'
						value={formData.lastName}
						onChange={handleChange}
						onBlur={() => handleBlur('lastName')}
					/>
					{touchedFields.lastName || errors.lastName ? (
						<div className='warning'>{errors.lastName}</div>
					) : null}
				</div>
				<div>
					<label htmlFor='birthday'>Birthday</label>
					<DatePicker
						name='birthday'
						data-testid='birthday'
						selected={formData.birthday}
						onChange={(date) => handleDateChange(date, 'birthday')}
						onBlur={() => handleBlur('birthday')}
						dateFormat='yyyy-MM-dd'
						showYearDropdown
						scrollableYearDropdown
						className='date-input birthday'
						placeholderText='YYYY-MM-DD'
					/>
				</div>
			</section>
			<section>
				<h3>User Management</h3>
				<div>
					<label htmlFor='userType'>User Type</label>
					<select
						name='userType'
						data-testid='userType'
						value={formData.userType}
						onChange={handleChange}
						onBlur={() => handleBlur('userType')}
					>
						<option value=''>Select User Type</option>
						{options.map((option, index) => (
							<option key={index} value={option}>
								{option}
							</option>
						))}
					</select>
					{touchedFields.userType || errors.userType ? (
						<div className='warning'>{errors.userType}</div>
					) : null}
				</div>
				<div>
					<label htmlFor='inactivityDate'>User Inactivity Date</label>
					<DatePicker
						id='inactivityDate'
						name='inactivityDate'
						label='User Inactivity Date'
						inputProps={{ 'aria-label': 'User Inactivity Date' }}
						selected={formData.inactivityDate}
						onChange={(date) => handleDateChange(date, 'inactivityDate')}
						onBlur={() => handleBlur('inactivityDate')}
						dateFormat='yyyy-MM-dd'
						showYearDropdown
						scrollableYearDropdown
						className='date-input'
						placeholderText='YYYY-MM-DD'
						disabled={formData.userType !== 'Inactive'}
					/>
					{touchedFields.inactivityDate || errors.inactivityDate ? (
						<div className='warning'>{errors.inactivityDate}</div>
					) : null}
				</div>
			</section>
			<button type='submit' onClick={handleSubmit}>
				Save
			</button>
		</form>
	)
}
