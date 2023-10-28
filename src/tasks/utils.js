import * as yup from 'yup'

export const options = ['Active', 'Inactive']

export const validationSchema = yup.object({
	firstName: yup.string().required('Please, provide your first name'),
	lastName: yup.string().required('Please, provide your last name'),
	birthday: yup.date().nullable(),
	userType: yup.string().required('Please, provide user type'),
	inactivityDate: yup
		.date()
		.when('userType', {
			is: 'Inactive',
			then: () =>
				yup
					.date()
					.required('Please, provide user inactivity date')
					.max(new Date(), 'user inactivity date must be in the past'),
		})
		.nullable(),
})
