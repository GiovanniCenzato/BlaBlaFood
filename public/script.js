// ====================================================
// ====================================================
// ==== Defining some functions to use in frontend ====
// ====================================================
// ====================================================
/**
 * @param {Object} announcement The annoouncement to visualize
 * @returns An HTML string to display
 */
export const visualizeAnnouncement = (announcement, isPast) => {
    // tbi: isPast is used to choose the color of the banner and some other stuff, to indicate if the 
    // announcement is outdated, is pending, is full etc.
    let temp = 
    `<div class="card h-100 w-100 mb-2">
        <div class="card-body">
            <table cellpadding="8">
            <tr><td><h2 class="card-title">${announcement.author.username}</h2></td>
            <td><h4>4 stelle</h4></td></tr>
            </table>
            <p class="card-subtitle" style="float: right;">tags: ${announcement.tags.join(' ')}</p>
            <p class="card-subtitle"><b>${announcement.title}</b></p>
            <p class="card-text">${announcement.description}</p>
        </div>
        <div class="card-footer">
            <a href="#" class="btn btn-primary" onclick="attemptBooking('${announcement.id}')">Prenota</a>
            <p class="card-subtitle" style="float: right;">Posti già prenotati: ${announcement.reservations.length}/${announcement.maxReservations}</p>
        </div>
    </div>`;
    return temp;
}

/**
 * @param {Object} waitingUser User waiting for approval
 * @param {Object} announcement Announcement for which user is waiting for approval
 * @returns An HTML string to display 
 */
export const visualizeUserConfirmationBanner = (waitingUser, announcement) => {
    let temp = 
    `<div class="card h-100 w-100 mb-2" id="${announcement._id}">
        <div class="card-body">
            <h2 class="card-title">Announcement: ${announcement.title}</h2>
            <p class="card-text">Waiting user: ${waitingUser.username}</p>
        </div>
        <button onclick="handleUser('${announcement._id}', '${waitingUser._id}', true)" >Accetta</button>
        <button onclick="handleUser('${announcement._id}', '${waitingUser._id}', false)" >Rifiuta</button>
    </div>`;
    return temp;
}