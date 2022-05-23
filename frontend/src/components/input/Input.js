import React from 'react'
import { useSelector } from 'react-redux'

const Input = (props) => {
	const validators = props.validators ? props.validators : {}
  return (
    <div className={"form__wrapper" + (validators[props.name] ? " form__wrapper--invalid" : "")}>
			<input {...props} className={props.className + (validators[props.name] ? " input--invalid" : "")}/>
			{
				validators[props.name] &&
				<div className="validators">
				{
					validators[props.name].map((validator, index) =>
						<div className="validator" key={index}>
							{validator}
						</div>
					)
				}
			</div>
			}
		</div>

  )
}

export default Input