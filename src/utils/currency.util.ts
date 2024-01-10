export default class CurrencyUtil {

    static convertToBrl(amount: number | undefined, prefix: boolean = true, decimalCount = 2, decimal = ",", thousands = ".") {

        if (isNaN(Number(amount)))
            return prefix ? 'R$ 0' : '0';

        if (amount) {

            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let tmp = amount.toString();

            let i = parseInt(tmp = Math.abs(Number(tmp) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            const result = negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - parseInt(i)).toFixed(decimalCount).slice(2) : "");

            if (prefix)
                return `R$ ${result}`;
            else
                return result;
        }
        else if (amount === 0)
            return prefix ? 'R$ 0' : '0';
        else
            return prefix ? 'R$ 0' : '0';
    }

    static convertToNumber(amount: string): number {

        let result: number = 0

        amount = amount.replace('R$', '');
        amount = amount.replace('.', '');
        amount = amount.replace(',', '.');

        result = Number(amount);

        return result;
    }
}