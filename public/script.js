document.addEventListener('DOMContentLoaded', function() {
    const vinForm = document.querySelector('form');
    const resultPanel = document.querySelector('.result-panel');
    
    if (!resultPanel.classList.contains('active')) {
        if (vinForm) {
            let loadingEl = document.querySelector('.loading');
            if (!loadingEl) {
                loadingEl = document.createElement('div');
                loadingEl.className = 'loading';
                vinForm.appendChild(loadingEl);
            }

            vinForm.addEventListener('submit', function() {
                loadingEl.classList.add('active');
                sessionStorage.setItem('formSubmitted', 'true');
            });
        }
    }
    
    if (sessionStorage.getItem('formSubmitted') === 'true') {
        const loadingEl = document.querySelector('.loading');
        if (loadingEl) {
            loadingEl.classList.remove('active');
        }
        sessionStorage.removeItem('formSubmitted');
    }
    
    const expandBtn = document.getElementById('expandSpecs');
    const specsContent = document.getElementById('specsContent');
    
    if (expandBtn && specsContent) {
        expandBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            specsContent.classList.toggle('active');
            
            const expandText = this.querySelector('.expand-text');
            if (expandText) {
                expandText.textContent = this.classList.contains('active') ? 'HIDE SPECS' : 'SHOW MORE SPECS';
            }
            
            const expandIcon = this.querySelector('.expand-icon');
            if (expandIcon) {
                expandIcon.textContent = this.classList.contains('active') ? '×' : '+';
            }
        });
    }
    
    const vinInput = document.getElementById('vin');
    if (vinInput) {
        // create VIN format guide
        const vinFormatContainer = document.createElement('div');
        vinFormatContainer.className = 'vin-format';
        vinFormatContainer.id = 'vinFormat';
        
        // add 17 character slots
        for (let i = 1; i <= 17; i++) {
            const charEl = document.createElement('div');
            charEl.className = 'vin-character';
            charEl.textContent = i;
            vinFormatContainer.appendChild(charEl);
        }
        
        const inputGroup = document.querySelector('.input-group');
        if (inputGroup) {
            inputGroup.parentNode.insertBefore(vinFormatContainer, inputGroup);
        }
        
        vinInput.addEventListener('focus', function() {
            vinFormatContainer.classList.add('active');
        });
        
        vinInput.addEventListener('blur', function() {
            if (this.value.length === 0) {
                vinFormatContainer.classList.remove('active');
            }
        });
        
        vinInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
            
            this.value = this.value.replace(/[^A-HJ-NPR-Z0-9]/g, '');
            
            const chars = vinFormatContainer.querySelectorAll('.vin-character');
            chars.forEach((char, index) => {
                if (index < this.value.length) {
                    char.style.color = '#232946';
                    char.style.fontWeight = 'bold';
                } else {
                    char.style.color = '#888';
                    char.style.fontWeight = 'normal';
                }
            });
            
            const submitBtn = document.querySelector('.btn-decode');
            if (submitBtn) {
                submitBtn.disabled = this.value.length !== 17;
                if (this.value.length === 17) {
                    submitBtn.classList.add('ready');
                } else {
                    submitBtn.classList.remove('ready');
                }
            }
        });
    }
    
    const container = document.querySelector('.container');
    if (container) {
        //adding decorationsss
        const coffeeStain = document.createElement('div');
        coffeeStain.className = 'coffee-stain';
        container.appendChild(coffeeStain);
        
        const decoderForm = document.querySelector('.decoder-form');
        if (decoderForm) {
            for (let i = 0; i < 3; i++) {
                const tab = document.createElement('div');
                tab.className = 'colored-tab';
                decoderForm.appendChild(tab);
            }
        }
    }
    
    
    if (resultPanel.classList.contains('active')) {
        const foldCorner = document.createElement('div');
        foldCorner.className = 'fold-corner';
        foldCorner.style.position = 'absolute';
        foldCorner.style.top = '0';
        foldCorner.style.right = '0';
        foldCorner.style.width = '40px';
        foldCorner.style.height = '40px';
        foldCorner.style.backgroundColor = '#f8f5f2';
        foldCorner.style.transformOrigin = 'top right';
        foldCorner.style.transform = 'rotate(-90deg)';
        foldCorner.style.borderRadius = '0 0 0 10px';
        foldCorner.style.boxShadow = '-2px 2px 3px rgba(0,0,0,0.1)';
        foldCorner.style.zIndex = '1';
        
        resultPanel.appendChild(foldCorner);
    }
    
    const resultHeader = document.querySelector('.result-header h2');
    if (resultHeader && resultPanel.classList.contains('active')) {
        const originalText = resultHeader.textContent;
        resultHeader.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                resultHeader.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 40);
            }
        };
        
        setTimeout(typeWriter, 300);
    }
    
    if (resultPanel.classList.contains('active')) {
        const detailItems = document.querySelectorAll('.detail-item');
        detailItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
        
        const resultDetails = document.querySelector('.result-details');
        if (resultDetails) {
            const postIt = document.createElement('div');
            postIt.style.position = 'absolute';
            postIt.style.width = '60px';
            postIt.style.height = '60px';
            postIt.style.backgroundColor = 'rgba(255, 230, 90, 0.6)';
            postIt.style.transform = 'rotate(10deg)';
            postIt.style.top = '-20px';
            postIt.style.right = '-20px';
            postIt.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.1)';
            postIt.style.zIndex = '1';
            
            resultDetails.style.position = 'relative';
            resultDetails.appendChild(postIt);
        }
    }
    
    const addHandDrawnArrow = (targetSelector, position = 'right') => {
        const target = document.querySelector(targetSelector);
        if (!target) return;
        
        const arrow = document.createElement('div');
        arrow.className = 'hand-drawn-arrow';
        arrow.style.position = 'absolute';
        arrow.style.width = '30px';
        arrow.style.height = '30px';
        
        // SVG arrow paths for different directions
        const arrowPaths = {
            right: "M0,15 C10,5 20,25 30,15 M20,5 L30,15 L20,25",
            left: "M30,15 C20,5 10,25 0,15 M10,5 L0,15 L10,25",
            up: "M15,30 C5,20 25,10 15,0 M5,10 L15,0 L25,10",
            down: "M15,0 C5,10 25,20 15,30 M5,20 L15,30 L25,20"
        };
        
        arrow.innerHTML = `<svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
            <path d="${arrowPaths[position]}" stroke="#ff8e3c" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        
        //position the arrow
        if (position === 'right') {
            arrow.style.left = 'calc(100% + 10px)';
            arrow.style.top = '50%';
            arrow.style.transform = 'translateY(-50%)';
        } else if (position === 'left') {
            arrow.style.right = 'calc(100% + 10px)';
            arrow.style.top = '50%';
            arrow.style.transform = 'translateY(-50%)';
        } else if (position === 'up') {
            arrow.style.bottom = 'calc(100% + 10px)';
            arrow.style.left = '50%';
            arrow.style.transform = 'translateX(-50%)';
        } else if (position === 'down') {
            arrow.style.top = 'calc(100% + 10px)';
            arrow.style.left = '50%';
            arrow.style.transform = 'translateX(-50%)';
        }
        
        target.style.position = 'relative';
        target.appendChild(arrow);
    };
    
    if (!resultPanel.classList.contains('active')) {
        addHandDrawnArrow('.btn-decode', 'right');
    }
    
    const addHandwrittenNote = (targetSelector, text, position = 'top-right') => {
        const target = document.querySelector(targetSelector);
        if (!target) return;
        
        const note = document.createElement('div');
        note.className = 'handwritten-note';
        note.textContent = text;
        note.style.position = 'absolute';
        note.style.fontFamily = 'cursive, "Comic Sans MS", sans-serif';
        note.style.fontSize = '0.8rem';
        note.style.color = '#555';
        note.style.maxWidth = '150px';
        note.style.lineHeight = '1.2';
        note.style.transform = 'rotate(-5deg)';
        note.style.zIndex = '2';
        
        //position the note
        if (position === 'top-right') {
            note.style.top = '-30px';
            note.style.right = '10px';
        } else if (position === 'top-left') {
            note.style.top = '-30px';
            note.style.left = '10px';
        } else if (position === 'bottom-right') {
            note.style.bottom = '-30px';
            note.style.right = '10px';
        } else if (position === 'bottom-left') {
            note.style.bottom = '-30px';
            note.style.left = '10px';
        }
        
        target.style.position = 'relative';
        target.appendChild(note);
    };
    
    if (!resultPanel.classList.contains('active')) {
        addHandwrittenNote('.decoder-form', '← enter your VIN here!', 'top-right');
    }
    
    setTimeout(() => {
        const vinInput = document.getElementById('vin');
        if (vinInput && !resultPanel.classList.contains('active')) {
            vinInput.style.transition = 'all 0.3s ease';
            vinInput.style.transform = 'scale(1.03)';
            vinInput.style.boxShadow = '0 0 10px rgba(255, 142, 60, 0.3)';
            
            setTimeout(() => {
                vinInput.style.transform = 'scale(1)';
                vinInput.style.boxShadow = 'none';
            }, 500);
        }
    }, 1000);
});