// 1. THE PROBLEM — Data flow & timezone shift
//    Dates are stored in the DB as UTC ISO strings (e.g. "2026-03-27T00:00:00.000Z")
//    When JavaScript parses this with new Date(), it converts to local time (Paris = UTC+2)
//    So "2026-03-27T00:00:00.000Z" becomes March 26 at 22:00 local → wrong day displayed
//    This affects : disabled days in the calendar, date comparison in handleSubmit

//So

// 2. THE SOLUTION — Stay in local time
//    Instead of letting JS convert UTC → local automatically,
//    we manually extract year/month/day from the string and build
//    the Date object directly in local time with new Date(year, month, day)
//    This way, "2026-03-27" always stays March 27, regardless of timezone

// toLocalDateString(date: Date) → "YYYY-MM-DD"
// Takes a local Date object and returns a string in YYYY-MM-DD format
// Used in handleDaySelect to convert react-day-picker's Date to a string for the back
// → getFullYear() / getMonth() / getDate() read local time (not UTC)
// → padStart(2, '0') ensures 2-digit format (e.g. "03" not "3")
// returns "YYYY-MM-DD"
export const toLocalDateString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// isoToLocalDate(isoString: string) → Date
// Takes a UTC ISO string from the DB and returns a local Date object with no timezone shift
// Used in disabledDays and availabilities.find() to compare dates correctly
// → split('T')[0] extracts "YYYY-MM-DD" from "2026-03-27T00:00:00.000Z"
// → split('-').map(Number) converts ["2026","03","27"] to [2026, 3, 27]
// → new Date(year, month - 1, day) builds the date in LOCAL time (month is 0-indexed → -1)
export const isoToLocalDate = (isoString: string): Date => {
    const [year, month, day] = isoString.split('T')[0].split('-').map(Number)
    return new Date(year, month - 1, day)
}

    //====
    // 'T' cut the string where a 'T' is found "2025-04-15T00:00:00.000Z" 
    // and [0] keep only the date part "2025-04-15" (first index of the array)
    //====
    
// Returns today at midnight in local time — used to disable past days in the calendar
export const getTodayMidnight = (): Date => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
}