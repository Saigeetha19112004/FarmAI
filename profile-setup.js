document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('farmerProfileForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-bar .step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.remove('active');
            progressSteps[index].classList.remove('active');
            if (index <= stepIndex) {
                progressSteps[index].classList.add('active');
            }
        });
        steps[stepIndex].classList.add('active');
        
        // Update buttons
        prevBtn.style.display = stepIndex === 0 ? 'none' : 'block';
        nextBtn.style.display = stepIndex === steps.length - 1 ? 'none' : 'block';
        submitBtn.style.display = stepIndex === steps.length - 1 ? 'block' : 'none';
    }

    function validateStep(step) {
        const inputs = step.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        
        return isValid;
    }

    nextBtn.addEventListener('click', () => {
        if (validateStep(steps[currentStep])) {
            currentStep++;
            showStep(currentStep);
        }
    });

    prevBtn.addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
    });

    document.getElementById('farmerProfileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const profileData = Object.fromEntries(formData);
        
        // Store data in localStorage
        localStorage.setItem('farmProfile', JSON.stringify(profileData));
        
        // Redirect to recommendations page
        window.location.href = 'recommendations.html';
    });
    // Add this after your existing DOMContentLoaded event listener
    document.querySelector('select[name="state"]').addEventListener('change', function() {
        const selectedState = this.value;
        const districtSelect = document.querySelector('select[name="district"]');
    
        // Clear existing options
        districtSelect.innerHTML = '<option value="">Select District</option>';
    
        // Populate districts if state is selected
        if (selectedState && districtData[selectedState]) {
            districtData[selectedState].forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    });

    // Initialize
    showStep(currentStep);
});