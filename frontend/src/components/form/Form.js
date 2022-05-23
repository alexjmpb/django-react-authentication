import React from 'react'

const Form = (props) => {
	const validators = props.validators ? props.validators : {}

	const inputChildren = props.children.filter(child => child.type.name === "Input")
	const inputNames = inputChildren.map(input => input.props.name)
	const validatorsEntries = Object.entries(validators)
	const filteredValidators = validatorsEntries.filter(attr => {
		let key = attr[0]
		return !inputNames.includes(key); 
	})
	const nonFieldValidators = Object.fromEntries(filteredValidators)

  return (
      <form {...props}>
				{props.children}
				{
					filteredValidators.length > 0 &&
					<div className="validators">
						{
							Object.keys(nonFieldValidators).map(key =>
								Array.isArray(nonFieldValidators[key]) ?
									nonFieldValidators[key].map(value => 
										<div className="validator">
											{value}
										</div>
									)
								: 
								<div className="validator">
									{nonFieldValidators[key]}
								</div>
							)
						}
					</div>
				}
				
			</form>
  )
}

export default Form