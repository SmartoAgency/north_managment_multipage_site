import i18next from 'i18next';
import { gsap } from 'gsap';
import * as yup from 'yup';
// eslint-disable-next-line import/no-extraneous-depende
import FormMonster from '../../../pug/components/form/form';
import SexyInput from '../../../pug/components/input/input';

const lang = document.documentElement.getAttribute('lang');
/*
 * form handlers start
 */
const forms = [
    '[data-popupn-form]',
    '[data-contact-screen-form]'
  ];
  console.log('ffff');
  forms.forEach((form) => {
    const $form = document.querySelector(form);
    if ($form) {
      /* eslint-disable */
      new FormMonster({
        /* eslint-enable */
        elements: {
          $form,
          successAction: () => { 
            $form.insertAdjacentHTML('beforeend', `
              <div data-success style="
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: var(--color-bg-colour);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                font-size: 21px;
                font-style: normal;
                line-height: 120%; /* 72px */
                z-index: 2;
                padding: 8px;
                padding-left: 40px;
                padding-right: 40px;
              ">
                <div style="padding-left: 40px; padding-right: 40px; text-align: center; margin-bottom: 10px;"  class="text-uppercase text-style-1920-h-2">
                  ${lang === 'es' ? 'Mensaje enviado' : 'Message sent'}
                </div>
                <div class="text-style-1920-body" style="text-align: center; margin-bottom: 40px; max-width:500px; margin-left: auto; margin-right: auto; " >
                ${lang === 'es' ? 'Gracias por la apelación.Espere la llamada de nuestros gerentes.Deseamos un buen día y buen humor' :'Thank you for the appeal. Expect the call of our managers. We wish a good day and good mood =)'}
                </div>
                <button data-form-popup-close type="button" onclick="this.closest('[data-success]').remove()" class="button-30 button-30--success-popup">
                  <span>${lang === 'es' ? 'Cerca':'Close'}</span>
                </button>
              
              </div>
            
            `);
            
            setTimeout(() => {
                // $form.querySelector('[data-success]').remove();
            }, 6000);
          },
          $btnSubmit: $form.querySelector('[data-btn-submit]'),
          fields: {
            name: {
              inputWrapper: new SexyInput({ animation: 'none', $field: $form.querySelector('[data-field-name]') }),
              rule: yup.string().required(i18next.t('required')).trim(),
              defaultMessage: i18next.t('name'),
              valid: false,
              error: [],
            },
  
            email: {
              inputWrapper: new SexyInput({ animation: 'none', $field: $form.querySelector('[data-field-email]') }),
              rule: yup
            .string()
            .test(
              'email-empty-or-valid',
              i18next.t('Invalid email format'),
              value => {
                if (!value || value.trim().length === 0) return true;
                // Use yup's built-in email validation
                return yup.string().email().isValidSync(value);
              }
                ),
  
              defaultMessage: i18next.t('email'),
              valid: false,
              error: [],
            },
            phone: {
              inputWrapper: new SexyInput({ animation: 'none', $field: $form.querySelector('[data-field-phone]'), typeInput: 'phone' }),
              rule: yup
                .string()
                .required(i18next.t('required'))
                .min(14, i18next.t('field_too_short', { cnt: 17 - 8 })),
  
              defaultMessage: i18next.t('phone'),
              valid: false,
              error: [],
            },
          },
  
        },
      });
    }
});


function useState(initialValue) {
  let value = initialValue;
  const subscribers = [];

  function setValue(newValue) {
    value = newValue;
    subscribers.forEach((subscriber) => subscriber(value));
  }

  function getState() {
    return value;
  }

  function subscribe(callback) {
    subscribers.push(callback);
    return () => {
      const index = subscribers.indexOf(callback);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  }

  return [getState, setValue, subscribe];
}

const formState = useState(false);

// const [ fromPopup, setFormPopup, useSetPopupEffect ] = 
const fromPopup = formState[0];
const setFormPopup = formState[1];
const useSetPopupEffect = formState[2];

useSetPopupEffect(val => {
  if (val) {
    gsap.to('[data-form-popup]', {
      autoAlpha: 1,
      pointerEvents: 'all'
    });
    return;
  }
  gsap.to('[data-form-popup]', {
    autoAlpha: 0,
    pointerEvents: 'none'
  });
})


document.body.addEventListener('click', (evt) => {
  const target = evt.target.closest('[data-form-popup-call]');
  if (!target) return;
  setFormPopup(true);
})
document.body.addEventListener('click', (evt) => {
  const target = evt.target.closest('[data-form-popup-close]');
  if (!target) return;
  setFormPopup(false);
})