const CorrectiveUI = {

render(state){

const tab = state.ui.activeCorrectiveTab

const incidents = state.corrective[tab] || []

const container = document.createElement("div")

incidents.forEach(inc=>{

const card = document.createElement("div")

card.className="bg-white p-6 rounded-xl shadow mb-4"

card.innerHTML=`

<div class="text-orange-600 font-bold">
${inc.incidentId}
</div>

<div class="text-sm text-gray-500">
${inc.node}
</div>

<div class="text-sm">
${inc.alarm}
</div>

<div class="text-sm text-blue-600">
ETA : ${inc.eta}
</div>

`

container.appendChild(card)

})

return container

}

}