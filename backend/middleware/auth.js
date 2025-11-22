// Authentication middleware

const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.userId) {
            return res.redirect('/login');
        }

        if (req.session.userRole !== role) {
            return res.status(403).render('error', {
                user: req.session.userId ? { role: req.session.userRole } : null,
                message: `Access denied. This page is for ${role}s only.`
            });
        }

        next();
    };
};

const redirectIfAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        // Redirect based on role
        if (req.session.userRole === 'farmer') {
            return res.redirect('/dashboard');
        } else {
            return res.redirect('/marketplace');
        }
    }
    next();
};

module.exports = {
    requireAuth,
    requireRole,
    redirectIfAuth
};
