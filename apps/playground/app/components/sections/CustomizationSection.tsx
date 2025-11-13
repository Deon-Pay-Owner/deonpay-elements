'use client'

import { CodeBlock } from '../ui/CodeBlock'

const cssVariables = [
  { name: '--colorPrimary', description: 'Color principal de botones y elementos activos', default: '#0070f3' },
  { name: '--colorBackground', description: 'Color de fondo de inputs', default: '#ffffff' },
  { name: '--colorText', description: 'Color del texto', default: '#1a1a1a' },
  { name: '--colorDanger', description: 'Color para errores', default: '#df1b41' },
  { name: '--fontFamily', description: 'Familia tipográfica', default: 'system-ui' },
  { name: '--fontSize', description: 'Tamaño base de fuente', default: '14px' },
  { name: '--fontSizeSmall', description: 'Tamaño de fuente pequeña', default: '12px' },
  { name: '--borderRadius', description: 'Radio de bordes', default: '8px' },
  { name: '--borderWidth', description: 'Grosor de bordes', default: '1px' },
  { name: '--borderColor', description: 'Color de bordes', default: '#e0e0e0' },
  { name: '--spacingUnit', description: 'Unidad de espaciado', default: '16px' }
]

export function CustomizationSection() {
  const customThemeCode = `const elements = deonpay.elements({
  clientSecret,
  appearance: {
    theme: 'flat', // o 'classic', 'dark'
    variables: {
      colorPrimary: '#7c3aed',
      colorBackground: '#fafafa',
      colorText: '#0a0a0a',
      fontFamily: '"Inter", system-ui, sans-serif',
      borderRadius: '12px',
      fontSize: '15px',
      borderWidth: '2px'
    }
  }
})`

  const advancedCustomCode = `const elements = deonpay.elements({
  clientSecret,
  appearance: {
    theme: 'flat',
    variables: {
      // Colores
      colorPrimary: '#6366f1',
      colorBackground: '#ffffff',
      colorText: '#18181b',
      colorDanger: '#ef4444',

      // Tipografía
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '14px',
      fontSizeSmall: '12px',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      fontWeightBold: '700',

      // Bordes y espaciado
      borderRadius: '10px',
      borderWidth: '1.5px',
      borderColor: '#e4e4e7',
      spacingUnit: '18px',

      // Sombras
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',

      // Estados
      colorTextPlaceholder: '#a1a1aa'
    },
    rules: {
      '.Input': {
        padding: '12px 16px',
        boxShadow: '0 0 0 1px #e4e4e7'
      },
      '.Input:focus': {
        boxShadow: '0 0 0 2px #6366f1'
      },
      '.Label': {
        fontSize: '13px',
        fontWeight: '600',
        color: '#27272a',
        marginBottom: '8px'
      }
    }
  }
})`

  const cssOverrideCode = `/* En tu CSS global */
.deonpay-elements {
  /* Sobrescribir estilos del contenedor */
  font-family: 'Tu Fuente', sans-serif;
}

.deonpay-input {
  /* Personalizar inputs */
  border-radius: 16px !important;
  padding: 14px 18px !important;
}

.deonpay-button {
  /* Personalizar botón de pago */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
}

.deonpay-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4) !important;
}`

  return (
    <div id="customization" className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Personalización
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Personaliza completamente la apariencia de DeonPay Elements para que coincida con tu marca.
        </p>
      </div>

      {/* Theme Options */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Temas Predefinidos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-blue-500">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Flat</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Diseño moderno y minimalista con colores planos y sin sombras pronunciadas.
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <code className="text-sm text-blue-600">theme: 'flat'</code>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-purple-500">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Classic</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Estilo profesional con bordes definidos y sombras sutiles.
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <code className="text-sm text-purple-600">theme: 'classic'</code>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border-2 border-cyan-500">
            <h4 className="text-lg font-bold text-white mb-2">Dark</h4>
            <p className="text-sm text-gray-400 mb-4">
              Modo oscuro elegante, perfecto para aplicaciones con tema nocturno.
            </p>
            <div className="bg-gray-800 rounded-lg p-4">
              <code className="text-sm text-cyan-400">theme: 'dark'</code>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Variables */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Variables CSS Disponibles
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Variable
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Descripción
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Valor por defecto
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {cssVariables.map((variable, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-6 py-4">
                      <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                        {variable.name}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {variable.description}
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm font-mono text-gray-900 dark:text-white">
                        {variable.default}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom Theme Example */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Crear un Tema Personalizado
        </h3>
        <CodeBlock
          code={customThemeCode}
          language="typescript"
          title="Ejemplo de tema personalizado"
        />
      </div>

      {/* Advanced Customization */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Personalización Avanzada con Rules
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Usa la propiedad <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">rules</code> para aplicar estilos CSS directamente a los elementos.
        </p>
        <CodeBlock
          code={advancedCustomCode}
          language="typescript"
          title="Personalización avanzada"
          maxHeight="600px"
        />
      </div>

      {/* CSS Override */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Sobrescribir con CSS Global
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          También puedes usar CSS global para sobrescribir estilos específicos.
        </p>
        <CodeBlock
          code={cssOverrideCode}
          language="css"
          title="styles.css"
        />
      </div>
    </div>
  )
}
