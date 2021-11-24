// Dropdown menu for Deliver vendor details
const vendors = document.querySelectorAll(".vendor");
const openDetails = document.querySelectorAll(".open-details");
const vendorDetails = document.querySelectorAll(".vendor-details");
console.log(vendors.length)
for (let i = 0; i < vendors.length; i++) {
    console.log('inside ' + i)
    openDetails[i].addEventListener('click', () => {
        if (vendorDetails[i].style.display == "block") {
            vendorDetails[i].style.display = "none"
        } else {
            vendorDetails[i].style.display = "block"
        }
    })
}
