'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Abdallah Ibrahim',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-02-21T14:11:59.604Z',
    '2021-02-25T17:01:17.194Z',
    '2021-02-27T23:36:17.929Z',
    '2021-02-28T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'ar-JO', // de-DE
};

const account2 = {
  owner: 'mohammed ibrahim',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date) {
  let calcDays = (day1, day2) =>
    Math.round(Math.abs(day1 - day2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDays(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yestrday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // let currYear = date.getFullYear();
  // let currMonth = `${date.getMonth() + 1}`.padStart(2, 0);
  // let currDay = `${date.getDate()}`.padStart(2, 0); // هون اذا كان رقم واحد بس بضيف 0 اذا كانو ثنين ما بضيف اشي
  // return `${currDay}/${currMonth}/${currYear}`;
  const option = {
    day: 'numeric',
    month: 'numeric', // 'long' , '2-digit'
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('en-JO', option).format(date);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${new Intl.NumberFormat(
          navigator.language,
          { style: 'currency', currency: 'USD' }
        ).format(mov.toFixed(2))}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'USD',
  }).format(acc.balance.toFixed(2))}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'USD',
  }).format(incomes.toFixed(2))}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(out).toFixed(2))}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'USD',
  }).format(interest.toFixed(2))}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
// 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢
// 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢
// 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢
// 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //In each call ,print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds , stop timer and log out user

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrese 1s
    time--;
  };
  // 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢
  // 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢
  // 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢
  // 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢
  //Set time to 5 minutes
  let time = 600;
  // call the timer event
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// // Display DAte
// let currDate = new Date();
// // let mDate = Datee.toISOString();
// let currYear = currDate.getFullYear();
// let currMonth = `${currDate.getMonth() + 1}`.padStart(2, 0);
// let currDay = `${currDate.getDate()}`.padStart(2, 0); // هون اذا كان رقم واحد بس بضيف 0 اذا كانو ثنين ما بضيف اشي

// document.querySelector(
//   '.date'
// ).textContent = `${currDay}/${currMonth}/${currYear}`;

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// Experimenting API

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢
    // 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢
    // 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢
    // 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢

    const now = new Date();
    const option = {
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long',
      day: 'numeric',
      month: 'numeric', // 'long' , '2-digit'
      year: 'numeric',
    };
    const local = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(local, option).format(now);
    // 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢
    // 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢
    // 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢
    // 🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢📗🟢

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
    // call the timer function
  }
});

btnTransfer.addEventListener('click', function (e) {
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      // Add movement
      currentAccount.movements.push(amount);
      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();

  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//*************************************************************Math and rounding*******************************************************************
// 📗📗
//  to convert from string to integer
// instead of using Number() we simply use + operator
//📗📗

// console.log(0.2 + 0.1);
// console.log(0.1 + 0.2 === 0.3);

// console.log(Number('23'));
// console.log(+'23');

// // parsing

// console.log(parseInt('30sdf asdfnoasnfnld 353px')); // it will only take the fist number
// // and if there is no number at the begining it will return NAN

// // 📗🟢 and parse actually accepts a second argument called radex
// // and the redex is the base of the numercal system (binary , decimal , hixadecimal )

// console.log(parseInt('30px', 10));
// console.log(parseInt('30px', 2));
// console.log(parseInt('30.25'));
// console.log(parseInt('2.5rem'));
// console.log(parseFloat('2.5rem'));
// console.log(parseFloat('2rem'));

// // checking if the value is a number
// console.log('isfinite');

// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(201));
// let c = 820;
// console.log(Number.isFinite(c));
// console.log('isInteger');
// console.log(Number.isInteger(312.64));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23));

//*************************************************************Math and rounding*******************************************************************

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));
// // 📗🟢📗 ** — Double star: power operator (exponentiation)
// // x ** 2 is equivalent to Math.pow(x, 2)

// let arr = [5, 18, 32, 11, 2];

// console.log(Math.max(5, 18, 32, 11, 2));
// console.log(Math.max(5, 18, '32', 11, 2));
// console.log(Math.max(5, 18, '32px', 11, 2));

// console.log(Math.max(...arr));

// console.log(Math.min(5, 18, 32, 11, 2));

// //Rounding Integers

// console.log(Math.trunc(23.3));

// console.log(Math.round(23.3)); // 23
// console.log(Math.round(23.9)); // 24

// console.log(Math.ceil(23.3)); // 24
// console.log(Math.ceil(23.9)); // 24

// console.log(Math.floor(23.3)); // 23
// console.log(Math.floor(23.9)); // 23

// // Rounding decimals
// // زي الي اخذناه في الاب تبع الداتا بيس
// // tofixed method will always return a string 📗
// console.log((32.7).toFixed(0)); // 0 decimal parts

// console.log((32.7).toFixed(2)); // 2 decimal parts

// console.log((32.7).toFixed(3)); // 3 decimal parts

// // convert to number

// console.log(+(32.7).toFixed(3));
////*************************************************************Creating Dates  *******************************************************************

// const now = new Date();

// console.log(now);
// console.log(new Date('27 Jan 2085'));

// console.log(now.getFullYear());
// console.log(now.getMonth() + 1); // the months is zero based
// console.log(now.getDate()); // get the day
// console.log(now.getHours());
// console.log(now.getMinutes());
// console.log(now.getSeconds());

// // we can get also a nice formatted string
// console.log(now.toISOString());
// console.log(now.getTime());
// console.log(Date.now());

// console.log(now.setFullYear(2040));
// console.log(now);
//*************************************************************Operation with dates  *******************************************************************

// let future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// let now = new Date();

// let calcDays = (day1, day2) =>
//   Math.trunc(Math.abs(day1 - day2) / (1000 * 60 * 60 * 24));

// console.log(calcDays(new Date(2037, 10, 19), new Date(2037, 10, 29)) + ' days');
// console.log(calcDays(new Date(), new Date(2021, 3, 12)) + ' days');

////*************************************************************international NUmbers *******************************************************************

// const num = 3884764.23;
// const option = {
//   style: 'unit',
//   // style:'percent',
//   // style:'currency',
//   // currency:'EUR',
//   unit: 'celsius',
//   // unit:'mile-per-hour',
//   useGrouping: false, // there is no (,OR.) between integer numbers
// };
// console.log(new Intl.NumberFormat('ar-JO', option).format(num));
// console.log(new Intl.NumberFormat('en-UK', option).format(num));
// console.log(new Intl.NumberFormat('en-US', option).format(num));

////************************************************************* setTimeout AND setInterval *******************************************************************

// setInterval
// in will be excuted every X time unit

// setInterval(() => {
//   const now = new Date();
//   console.log(now);
// }, 1000);

// // setInterval(() => {
// //   const now = new Date();
// //   // console.log(

//   // );
// //   labelTimer.textContent = new Intl.DateTimeFormat('en-US', {
// //     hour: 'numeric',
// //     minute: 'numeric',
// //     second: 'numeric',
// //   }).format(now);
// // }, 1000);

// }
