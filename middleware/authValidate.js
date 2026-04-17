export const validateRegister = (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;

    // 1. Check required fields
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Full name validation
    if (full_name.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 3 characters",
      });
    }

    // 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 4. Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // 5. Trim values (clean data)
    req.body.full_name = full_name.trim();
    req.body.email = email.trim().toLowerCase();

    next(); // go to controller
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Validation error",
    });
  }
};



export const validateLogin = (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 3. Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // 4. Clean data
    req.body.email = email.trim().toLowerCase();

    next(); // go to controller
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Validation error",
    });
  }
};