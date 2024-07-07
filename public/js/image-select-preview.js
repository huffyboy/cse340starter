document.addEventListener("DOMContentLoaded", function() {
    var imageSelect = document.querySelectorAll("select[name='inv_image'], select[name='inv_thumbnail']");
    
    imageSelect.forEach(function(selectElement) {
        var imagePreview = selectElement.nextElementSibling.querySelector("img");

        selectElement.addEventListener("change", function() {
            var selectedOption = selectElement.options[selectElement.selectedIndex].value;
            imagePreview.src = selectedOption;
        });
    });
});
