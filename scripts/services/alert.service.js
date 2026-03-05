// scripts/services/alert.service.js

window.AlertService = {

  loadFromLocal() {

  const alerts = LocalDB.getAlerts()

    Store.dispatch(state => ({
      ...state,
      alerts: [...state.alerts, ...alerts]
    }));

    },

  async loadFromEmail() {
    const emails = await EmailRepository.getUnreadAlerts();

    const alerts = emails.map(email =>
      EmailParser.toAlert(email)
    );

    Store.dispatch(state => ({
      ...state,
      alerts
    }));
    },
    completeAlert(incidentId) {

    Store.dispatch(state => ({
    ...state,
    alerts: state.alerts.map(a =>
    a.incidentId === incidentId
    ? { ...a, status: 'COMPLETE' }
    : a
    )
    }))

},
    cancelAlert(incidentId) {

    const alerts = LocalDB.getAlerts()

    const updated = alerts.map(a =>
    a.incidentId === incidentId
    ? { ...a, status: "CANCEL" }
    : a
    )

    LocalDB.saveAlerts(updated)

    Store.dispatch(state => ({
    ...state,
    alerts: updated
    }))

    },
    createAlert(alertData) {

    const newAlert = {
    incidentId: alertData.incidentId,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    ...alertData
    }

    LocalDB.addAlert(newAlert)

    Store.dispatch(state => ({
    ...state,
    alerts: [...state.alerts, newAlert]
    }))

    },
    responseAlert(incidentId, eta){

    const state = Store.getState()

    const alert = state.alerts.find(a => a.incidentId === incidentId)

    if(!alert) return

    let type = "other"

    if(alert.workType === "Fiber") type = "fiber"
    if(alert.workType === "Equipment") type = "equipment"

    Store.dispatch(s => ({

    ...s,

    alerts: s.alerts.filter(a => a.incidentId !== incidentId),

    corrective:{
    ...s.corrective,
    [type]:[
    ...(s.corrective[type] || []),
    {
    ...alert,
    eta,
    status:"PROCESS"
    }
    ]
    }

    }))

    }

  };