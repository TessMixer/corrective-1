const LocalDB = {

KEY: "noc-alerts",

getAlerts() {

const data = localStorage.getItem(this.KEY)

return data ? JSON.parse(data) : []

},

saveAlerts(alerts) {

localStorage.setItem(this.KEY, JSON.stringify(alerts))

},

addAlert(alert) {

const alerts = this.getAlerts()

alerts.push(alert)

this.saveAlerts(alerts)

},

deleteAlert(incidentId) {

let alerts = this.getAlerts()

alerts = alerts.filter(a => a.incidentId !== incidentId)

this.saveAlerts(alerts)

}

}