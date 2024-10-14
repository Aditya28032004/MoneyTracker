
      let l1 = JSON.parse(localStorage.getItem('incomeList')) || [];
      let l2 = JSON.parse(localStorage.getItem('expenditureList')) || [];

      displayInputAmount();
      displayInputAmountEx();

      function toIncome() {
        let inputAmount = document.querySelector('#IncomeAmount');
        let inputSource = document.querySelector('#IncomeSource');
        let inputValue = inputAmount.value;
        let Source = inputSource.value;

        if (inputValue && Source) {
          l1.push({ Amount: inputValue, source: Source });
          localStorage.setItem('incomeList', JSON.stringify(l1));
          inputAmount.value = '';
          inputSource.value = '';
          displayInputAmount();
        }
      }

      function displayInputAmount() {
        let displayItem = document.querySelector('.incomeAmountShow');
        let newHtml = '';
        let inn = 0;
        for (let i = 0; i < l1.length; i++) {
          let c = Number(l1[i].Amount);
          inn += c;

          let inputValue = l1[i].Amount;
          let Source = l1[i].source;
          newHtml += `
            <span> ${i + 1} : ${inputValue} From ${Source}</span>
            <div></div>
          `;
        }
        displayItem.innerHTML = newHtml;
        document.querySelector('.in').innerText = inn;
        updateTotal();
      }

      function toEx() {
        let inputAmount = document.querySelector('#ExpenditureAmount');
        let inputSource = document.querySelector('#ExpenditureSource');
        let inputValue = inputAmount.value;
        let Source = inputSource.value;

        if (inputValue && Source) {
          l2.push({ Amount: inputValue, source: Source });
          localStorage.setItem('expenditureList', JSON.stringify(l2));
          inputAmount.value = '';
          inputSource.value = '';
          displayInputAmountEx();
        }
      }

      function displayInputAmountEx() {
        let displayItem = document.querySelector('.exx');
        let newHtml = '';
        let outt = 0;
        for (let i = 0; i < l2.length; i++) {
          let c = Number(l2[i].Amount);
          outt += c;

          let inputValue = l2[i].Amount;
          let Source = l2[i].source;
          newHtml += `
            <span> ${i + 1} : ${inputValue} For ${Source}</span>
            <div></div>
          `;
        }
        displayItem.innerHTML = newHtml;
        document.querySelector('.out').innerText = outt;
        updateTotal();
      }

      function updateTotal() {
        let x = document.querySelector('.in');
        let y = document.querySelector('.out');
        let a = Number(x.innerText);
        let b = Number(y.innerText);
        document.querySelector('.total').innerText =(a - b);
      }

      function clearData() {
        localStorage.removeItem('incomeList');
        localStorage.removeItem('expenditureList');
        l1 = [];
        l2 = [];
        displayInputAmount();
        displayInputAmountEx();
        document.querySelector('.total').innerText =   0;
      }
    