
 function statement(invoice, plays) {
    let result = `Счет для ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("ru-RU",
                    { style: "currency", currency: "RUB",
                      minimumFractionDigits: 2 }).format;

    for (let perf of invoice.performance) {
        // Вывод строки счета
        result += ` ${getPlay(perf).name}: ${format(amountCount(perf) / 100)}`;
        result += ` (${perf.audience} мест)\n`;
    };

    result += `Итого с вас ${format(getTotalAmount()/100)}\n`;
    result += `Вы заработали ${getTotalVolumeCredits()} бонусов\n`;
    return result;

    function getPlay(perf){
        return plays[perf.playId];
    }
    
    function amountCount(perf){
        let thisAmount = 0;
        switch (getPlay(perf).type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`неизвестный тип: ${getPlay(perf).type}`);
        }
        return thisAmount;
    }

    function bonusCount(perf){
        // Добавление бонусов + дополнительный бонус за каждые 10 комедий
        return Math.max(perf.audience - 30, 0) + ("comedy" === getPlay(perf).type ? Math.floor(perf.audience / 10) : 0);
    }

    function getTotalVolumeCredits(){
        let totalVolumeCredits = 0;
        for (let perf of invoice.performance) {
            totalVolumeCredits += bonusCount(perf);
        }
        return totalVolumeCredits;
    }

    function getTotalAmount(){
        let totalAmount = 0;
        for(let perf of invoice.performance){
            totalAmount += amountCount(perf);
        }
        return totalAmount;
    }
};
