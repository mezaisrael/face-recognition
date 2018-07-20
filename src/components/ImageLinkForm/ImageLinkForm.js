import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({onChangeInput, submit}) => {
	return(
		<div className='f3'>
			<p>{'This magic brain will detect faces in your pictures'}</p>

			<div className='form br3 shadow-5 pa4 center'>
				<input className='f4 pa2 w-70' type='text'
						onChange={onChangeInput}/>
				<button 
					className='f4 w-30 link grow pv2 dib white bg-light-purple bw0'
					onClick={submit}>
					Detect
				</button>
			</div>
		</div>
	)
}

export default ImageLinkForm;