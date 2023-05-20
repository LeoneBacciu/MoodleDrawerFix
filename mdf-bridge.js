// Simple bridge that gets the session key from the main page js
document.dispatchEvent(new CustomEvent('mdf-data', {detail: M.cfg.sesskey}))