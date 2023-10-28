import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { FormTaskComplete } from './FormTaskComplete'

describe('FormTaskComplete Component', () => {
	test('displays validation error when First Name is empty and touched', async () => {
		await act(async () => {
			render(<FormTaskComplete />)
			const firstNameInput = screen.getByTestId('firstName')
			fireEvent.blur(firstNameInput)
			const validationMessage = await screen.findByText(
				'Please, provide your first name'
			)
			expect(validationMessage).toBeInTheDocument()
		})
	})

	test('displays validation error when Last Name is empty and touched', async () => {
		await act(async () => {
			render(<FormTaskComplete />)
			const lastNameInput = screen.getByTestId('lastName')
			fireEvent.blur(lastNameInput)
			const validationMessage = await screen.findByText(
				'Please, provide your last name'
			)
			expect(validationMessage).toBeInTheDocument()
		})
	})

	test('displays validation error when User Inactivity Date is empty and User Type is "Inactive"', async () => {
		render(<FormTaskComplete />)
		const userTypeSelect = screen.getByTestId('userType')

		userEvent.selectOptions(userTypeSelect, 'Inactive')
		await waitFor(() => {
			expect(screen.queryByText('Please, provide user type')).toBeNull()
		})

		const inactivityDateInput = screen.getByLabelText('User Inactivity Date')
		fireEvent.blur(inactivityDateInput)

		await waitFor(() => {
			const validationMessage = screen.getByText(
				'Please, provide user inactivity date'
			)
			expect(validationMessage).toBeInTheDocument()
		})
	})

	test('displays validation error when User Inactivity Date is not in the past', async () => {
		render(<FormTaskComplete />)
		const userTypeSelect = screen.getByTestId('userType')
		userEvent.selectOptions(userTypeSelect, 'Inactive')
		const inactivityDateInput = screen.getByLabelText('User Inactivity Date')
		fireEvent.change(inactivityDateInput, { target: { value: '2100-01-01' } })
		fireEvent.blur(inactivityDateInput)
		const validationMessage = await screen.findByText(
			'user inactivity date must be in the past'
		)
		expect(validationMessage).toBeInTheDocument()
	})

	test('displays no validation error when all fields are filled correctly', async () => {
		await act(async () => {
			render(<FormTaskComplete />)
			const userTypeSelect = screen.getByTestId('userType')
			userEvent.selectOptions(userTypeSelect, 'Inactive')
			const firstNameInput = screen.getByTestId('firstName')
			const lastNameInput = screen.getByTestId('lastName')
			const inactivityDateInput = screen.getByLabelText('User Inactivity Date')
			fireEvent.change(firstNameInput, { target: { value: 'John' } })
			fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
			fireEvent.change(inactivityDateInput, { target: { value: '2022-01-01' } })
			fireEvent.blur(firstNameInput)
			fireEvent.blur(lastNameInput)
			fireEvent.blur(inactivityDateInput)
			await waitFor(() => {
				expect(
					screen.queryByText('Please, provide your first name')
				).not.toBeInTheDocument()
				expect(
					screen.queryByText('Please, provide your last name')
				).not.toBeInTheDocument()
				expect(
					screen.queryByText('Please, provide user inactivity date')
				).not.toBeInTheDocument()
				expect(
					screen.queryByText('user inactivity date must be in the past')
				).not.toBeInTheDocument()
			})
		})
	})
})
