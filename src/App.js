import React, { useState, useEffect } from 'react';
import alarm from './alarm.mp3';
import msToTime from './helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRedo } from '@fortawesome/free-solid-svg-icons';
import 'rc-input-number/assets/index.css';
import InputNumber from 'rc-input-number';

import './App.scss';


const App = () => {

	const [bar, setBar] = useState(0);
	const [duration, setDuration] = useState(1500);
	const [workDuration, setWorkDuration] = useState(1500);
	const [restDuration, setRestDuration] = useState(300);
	const [timeLeft, setTimeLeft] = useState(duration);
	const [status, setStatus] = useState(false);
	const [settingsStatus, setSettingsStatus] = useState(false);
	const [typeStatus, setTypeStatus] = useState('work');
	const [total, setTotal] = useState(0);

	const PlayAlarm = () => (
		<audio autoPlay src={alarm} />
	)

	const handleWorkDuration = value => {
		setTimeLeft(value * 60);
		setWorkDuration(value * 60);
		setDuration(value * 60);
	}

	const handleRestDuration = value => {
		setRestDuration(value * 60);
	}

	const startTimer = () => {
		setStatus(!status);
		setSettingsStatus(true);
	}

	const resetTimer = () => {
		setStatus(false);
		setBar(0);
		setTypeStatus('work');
		setDuration(1500);
		setTimeLeft(workDuration);
		setTotal(0);
		setSettingsStatus(false)
	}

	useEffect(() => {

		let interval = null;
		if (status) {

			if (bar > 100) {
				setBar(0);
				if (typeStatus === 'work') {
					setTimeLeft(restDuration);
					setTypeStatus('rest');
					setDuration(restDuration);
					setTotal(total + 1);
				}
				if (typeStatus === 'rest') {
					setTimeLeft(workDuration);
					setTypeStatus('work');
					setDuration(workDuration);
				}
			};

			interval = setInterval(() => {
				setBar(bar + (100 / duration));
				setTimeLeft(timeLeft - 1);
			}, 1000);

		} else {
			clearInterval(interval);
		}
		return () => { clearInterval(interval) };

	}, [status, bar, timeLeft, duration, restDuration, total, typeStatus, workDuration]);

	return (
		<div className="App">
			<div className="timer-settings">
				<div className="work-time">
					<span>Work Time: </span>
					<InputNumber
						aria-label="Work Time"
						defaultValue={5}
						min={5}
						max={25}
						style={{ width: 100 }}
						value={workDuration / 60}
						step={5}
						onChange={handleWorkDuration}
						disabled={settingsStatus === true}
						autoFocus={true}
					/>
				</div>
				<div className="rest-time">
					<span>Rest Time: </span>
					<InputNumber
						aria-label="Rest Time"
						defaultValue={1}
						min={1}
						max={15}
						style={{ width: 100 }}
						value={restDuration / 60}
						step={1}
						onChange={handleRestDuration}
						disabled={settingsStatus === true}
					/>
				</div>
			</div>

			<div className="timer-wrap">
				<div className="btn btn-animate start-timer" onClick={startTimer}><FontAwesomeIcon icon={status ? faPause : faPlay} /></div>
				<div className="btn btn-animate reset-timer" onClick={resetTimer}><FontAwesomeIcon icon={faRedo} /></div>

				<div className="timer-circle">
					<div className={`timer-filler ${typeStatus}`} style={{ height: `${bar}%`, color: '#fff', fontSize: '40px' }}>
					</div>

					<div className="timer"><h1>{msToTime(timeLeft * 1000)}</h1></div>
					<div className="total"><h3>{total}</h3></div>

					{(bar === 100) && <PlayAlarm />}
				</div>
			</div>

		</div>
	);
}

export default App;
