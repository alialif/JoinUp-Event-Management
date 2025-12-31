# Bilingual Support Guide

JoinUp supports multiple languages to serve diverse user communities. Complete guide to language configuration, translation management, and localization.

---

## Supported Languages

### Current Languages

| Language | Code | Region | Status |
|----------|------|--------|--------|
| **English** | en | Universal | ✅ Fully Supported |
| **French Canadian** | fr-CA | Canada (Quebec) | ✅ Fully Supported |

### Future Language Support

- Spanish (es)
- German (de)
- Japanese (ja)
- Mandarin (zh)

(Translations can be added by contributing translations to the project)

---

## Switching Languages

### In the User Interface

1. **Look for Language Selector**
   - Typically in top-right header
   - Often displayed as flag icon or language code
   - May be in settings/profile menu

2. **Click Language Selector**
   - Dropdown menu appears
   - Shows available languages

3. **Select Desired Language**
   - Click English (en) or Français (fr-CA)
   - Page immediately switches language
   - Selection saved in user preferences

### Language Persistence

**What Gets Saved:**
- Your language preference
- Stored in browser local storage
- Retrieved on next login
- Applies to all pages

**What Doesn't Change:**
- User-entered content (event titles, descriptions, etc.)
- Database values remain in original language
- Only UI labels and messages translate

---

## Translated User Interface Elements

### Login & Authentication

**English:**
- Login
- Register
- Email
- Password
- Forgot Password?

**Français:**
- Connexion
- S'inscrire
- Courriel
- Mot de passe
- Mot de passe oublié?

### Navigation Menu

**English:**
- Events
- My Events
- Profile
- Settings
- Logout

**Français:**
- Événements
- Mes Événements
- Profil
- Paramètres
- Déconnexion

### Events Interface

**English:**
- Create Event
- View Event
- Register
- Mark Attendance
- Issue Certificate

**Français:**
- Créer un Événement
- Afficher l'Événement
- S'Inscrire
- Marquer la Présence
- Émettre un Certificat

### User Management

**English:**
- Users
- Change Role
- Delete User
- Promote to Staff
- Make Admin

**Français:**
- Utilisateurs
- Changer le Rôle
- Supprimer l'Utilisateur
- Promouvoir le Personnel
- Rendre Administrateur

### Messages & Notifications

**Success Messages:**

English: "Event created successfully!"
Français: "L'événement a été créé avec succès!"

English: "Certificate issued!"
Français: "Certificat émis!"

**Error Messages:**

English: "Email already exists"
Français: "Le courriel existe déjà"

English: "Event is full"
Français: "L'événement est plein"

---

## Multilingual Content

### User-Entered Content

**Not Automatically Translated:**
- Event titles
- Event descriptions
- Participant names
- Comments and notes

**Recommendation:**
- Use translation tool for multilingual events
- Or create separate events in each language
- Provide bilingual descriptions if targeting both audiences

### Certificates

**Certificates Contain:**
- Participant name (not translated)
- Event title (in original language)
- Date (localized to selected language)
- All labels (in selected language)

**Example Certificate (English):**
```
CERTIFICATE OF ATTENDANCE
This certifies that
Marie Dupont
Has successfully attended
Angular Advanced Workshop
```

**Example Certificate (French):**
```
CERTIFICAT DE PARTICIPATION
Ceci certifie que
Marie Dupont
A assisté avec succès à
Angular Advanced Workshop
```

---

## Technical Implementation

### Translation Files

**Location:** `frontend/src/assets/i18n/`

**Files:**
- `en.json` - English translations
- `fr-CA.json` - French-Canadian translations

### File Structure Example

```json
{
  "auth": {
    "login": "Login",
    "register": "Register",
    "email": "Email",
    "password": "Password"
  },
  "events": {
    "createEvent": "Create Event",
    "viewEvent": "View Event",
    "register": "Register"
  },
  "messages": {
    "success": {
      "eventCreated": "Event created successfully!",
      "certificateIssued": "Certificate issued!"
    },
    "error": {
      "emailExists": "Email already exists",
      "eventFull": "Event is full"
    }
  }
}
```

### Adding New Translations

**To Add a New Translation Key:**

1. **Update en.json:**
   ```json
   "newFeature": "New Feature Label"
   ```

2. **Update fr-CA.json:**
   ```json
   "newFeature": "Étiquette de Nouvelle Fonctionnalité"
   ```

3. **Use in Code:**
   ```typescript
   {{ 'newFeature' | translate }}
   ```

### Using Translations in Code

**In HTML Templates:**
```html
<button>{{ 'auth.login' | translate }}</button>
<label>{{ 'events.createEvent' | translate }}</label>
```

**In TypeScript:**
```typescript
constructor(private translate: TranslateService) {}

getMessage() {
  return this.translate.instant('messages.success.eventCreated');
}
```

---

## Language Support for New Features

### When Adding New Features

1. **Add English Translation**
   - Add key and value to `en.json`
   - Test with English language

2. **Add French Translation**
   - Add corresponding French-Canadian translation
   - Maintain key consistency

3. **Test Both Languages**
   - Switch language in UI
   - Verify translation displays correctly
   - Check for text overflow/spacing

### Translation Quality

**Best Practices:**
- ✅ Use professional translations
- ✅ Have native speakers review
- ✅ Keep context in mind
- ✅ Maintain consistent terminology
- ❌ Don't use machine translation without review
- ❌ Don't translate placeholder text

---

## Locale-Specific Features

### Date & Time Formatting

**English Format:**
- 12/15/2025 (MM/DD/YYYY)
- 3:30 PM

**French-Canadian Format:**
- 2025-12-15 (YYYY-MM-DD)
- 15:30

### Number & Currency Formatting

**English:**
- $1,234.56 (dollar sign, thousand separator comma, period for decimal)

**French-Canadian:**
- 1 234,56 $ (space for thousand separator, comma for decimal, dollar sign at end)

### Default Language by Locale

**Browser Language Detection:**
- System automatically detects browser language
- If browser is set to French, JoinUp opens in French
- Users can override with language selector

---

## Troubleshooting Translations

### Text Not Translating

**Possible Causes:**
- Translation key not in JSON file
- Typo in key name
- Translation service not initialized
- Browser cache not cleared

**Solutions:**
- Check key exists in both en.json and fr-CA.json
- Verify key name matches exactly (case-sensitive)
- Clear browser cache (Ctrl+Shift+Delete)
- Check console for errors
- Restart development server

### Text Overflow or Truncation

**Possible Cause:**
- Translated text longer than original
- English shorter than French equivalent

**Common Overflow Areas:**
- Buttons with text
- Menu items
- Form labels

**Solutions:**
- Use CSS to expand container
- Use text wrapping
- Shorten translation (if possible)
- Use abbreviations in French

### Missing Translation

**What Shows:**
- Translation key displayed as-is: `[MISSING TRANSLATION: auth.login]`
- Or empty space where text should be

**How to Fix:**
- Add missing translation key to JSON files
- Verify spelling of key
- Restart application
- Clear browser cache

---

## Contributing Translations

### For Translation Volunteers

1. **Fork Repository** (if open source)
2. **Add Translations**
   - Edit JSON files
   - Follow existing format
   - Maintain key structure

3. **Test Thoroughly**
   - Test in UI with new language
   - Check text doesn't overflow
   - Verify all screens work

4. **Submit Pull Request**
   - Include translation files
   - Note which language added
   - Describe any special considerations

### Quality Standards

**Each Translation Should:**
- ✅ Match English key exactly
- ✅ Use professional language
- ✅ Fit in UI without overflow
- ✅ Be reviewed by native speaker
- ✅ Use consistent terminology
- ✅ Not exceed 120 characters (generally)

---

## Future Internationalization Plans

### Planned Features

- **More Languages**: Spanish, German, Japanese, Mandarin
- **RTL Support**: Arabic, Hebrew (right-to-left)
- **Regional Variants**: en-US, en-GB, en-AU, fr-FR, etc.
- **Auto-Translation**: Integration with translation APIs
- **Localized Content**: Region-specific event categories, terminology

### Community Contributions

We welcome translations from the community:
- Submit translations via GitHub
- Contact project team for guidelines
- Test translations in full application
- Provide feedback on terminology

---

## Best Practices for Multilingual Events

### Creating Bilingual Events

**Option 1: Separate Events**
- Create two identical events
- One in English, one in French
- Easier to manage capacity
- Each has own registrations

**Option 2: Single Event Description**
```
Event Title: Angular Advanced Workshop / Atelier Angular Avancé

Description:
[English]
Learn advanced Angular concepts including RxJS, state management,
and performance optimization.

[Français]
Apprenez les concepts avancés d'Angular, y compris RxJS, la gestion
de l'état et l'optimisation des performances.
```

### Bilingual Announcements

**Email/Notifications:**
- Send bilingual emails
- Based on user language preference
- Include both languages

**Certificate:**
- Certificates generate in selected language
- Event title stays original
- All labels translated

---

## Related Documentation

- [User Roles & Permissions](./03-User-Roles.md)
- [Event Management](./04-Event-Management.md)
- [Architecture - Internationalization](./09-Architecture.md)

---

**Need help?** Check [Troubleshooting - Language Issues](./15-Troubleshooting.md#language-issues)
