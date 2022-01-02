import { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import './styles/App.scss';

export default function App() {
  const alertBox = useRef(null)
  const [isCopied, setIsCopied] = useState(false)
  const [passSettings, setPassSettings] = useState({
    length: 6,
    specialSymbols: true,
    numbers: true,
    uppercase: true,
    lowercase: true,
    ambigious: true
  })
  const passwordChars = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890~`!@#$%^&*()_-+={[}]|\\:;"\'<,>.?/'

  const [newPass, setNewPass] = useState('')
  
  const labelsArray = [
    {
      name: 'Include special symbols:',
      value: 'specialSymbols'
    },
    {
      name: 'Include numbers:',
      value: 'numbers'
    },
    {
      name: 'Include uppercase:',
      value: 'uppercase'
    },
    {
      name: 'Include lowercase:',
      value: 'lowercase'
    },
    {
      name: 'Use ambigious symbols:',
      value: 'ambigious'
    },
  ]

  const checkPassLength = e => {
    const { value } = e.target
    if(value.match(/^\d+$/) || value === '') {
      Number(value) > 1024 ? setPassSettings({...passSettings, length: 1024}) :
      setPassSettings({...passSettings, length: value === '' ? '' : Number(value)})
    }
  }

  const copyToClipboard = e => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(e.target.textContent)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 3000)
      })
      .catch(err => console.log(err))
    }
  }

  const getAvailableChars = () => {
    let chars = passwordChars

    if(!passSettings.lowercase && !passSettings.uppercase && !passSettings.specialSymbols && !passSettings.numbers) chars = ''
    if(!passSettings.lowercase) chars = chars.replace(/[a-z]/g, '')
    if(!passSettings.uppercase) chars = chars.replace(/[A-Z]/g, '')
    if(!passSettings.numbers) chars = chars.replace(/[0-9]/g, '')
    if(!passSettings.specialSymbols) chars = chars.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '')
    if(!passSettings.ambigious) chars = chars.replace(/[`~();:'",.<>{}[\]\\/]/gi, '')

    return chars
  }

  const generatePassword = () => {
    let availableChars = getAvailableChars()
    let pass = ''

    if(availableChars !== '') {
      for (let i = 0; i < passSettings.length; i++) {
        pass += availableChars[Math.floor(Math.random() * availableChars.length)]
      }
    }
    setNewPass(pass)
  }

  return (
    <div className="App">
      <CSSTransition nodeRef={alertBox} in={isCopied} timeout={800} classNames="alert-box">
        <div ref={alertBox} className="alert-box">
          Password is copied
        </div>
      </CSSTransition>
      <h1>Password generator</h1>
      <div className="password-generator__wrapper">
        <div className="password-generator__form__inputs">
          <label>
            <span>Password length: </span>
            <input
              type="text"
              value={passSettings.length}
              onChange={checkPassLength}
            />
          </label>
          {
            labelsArray.map(({name, value}) => (
              <label key={name}>
                <span>{name}</span>
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={e => setPassSettings({...passSettings, [value]: e.target.checked})}
                />
              </label>
            ))
          }
        </div>
        <button onClick={generatePassword}>Generate</button>
        <div className="password-generator__form__password">
          Generated password: <span onClick={copyToClipboard}>{newPass}</span>
        </div>
      </div>
    </div>
  );
}