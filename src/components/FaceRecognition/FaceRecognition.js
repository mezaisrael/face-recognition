import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl, box, showBox}) => {

	return(
		<div className="mt2 faceContainer">
			<div className='absolute'>
				<img id='inputimage' alt='' src={imageUrl} width='500px' height='auto'/>
				<div
					className='bounding_box'
					style={{
							top: box.topRow,
							left: box.leftCol,
							right: box.rightCol,
							bottom: box.bottomRow,
							visibility: showBox
							}}>
				</div>
			</div>
		</div>
	);
}

export default FaceRecognition;