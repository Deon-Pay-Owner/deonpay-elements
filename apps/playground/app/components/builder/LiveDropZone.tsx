'use client'

import { useDroppable } from '@dnd-kit/core'
import { ElementType } from './ElementCard'

interface LiveDropZoneProps {
  elements: ElementType[]
  onRemove: (id: string) => void
  amount: number
  onAmountChange: (value: string) => void
  onPayment: () => void
  loading: boolean
  processing: boolean
  error: string
  result: any
  buttonConfig: any
  customColor: string
  borderRadius: number
  fontFamily: string
  mounted: boolean
  hasPaymentElement: boolean
}

export function LiveDropZone({
  elements,
  onRemove,
  amount,
  onAmountChange,
  onPayment,
  loading,
  processing,
  error,
  result,
  buttonConfig,
  customColor,
  borderRadius,
  fontFamily,
  mounted,
  hasPaymentElement,
}: LiveDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'live-drop-zone'
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Payment Form */}
      <div
        ref={setNodeRef}
        className={`
          bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 transition-all duration-200
          ${isOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.01]'
            : 'border-gray-200 dark:border-gray-700'
          }
        `}
      >
        <div className="p-6">
          {/* Amount Input */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monto a cobrar
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">
                $
              </span>
              <input
                type="number"
                value={(amount / 100).toFixed(2)}
                onChange={(e) => onAmountChange(e.target.value)}
                className="w-full pl-8 pr-16 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-lg font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100.00"
                step="0.01"
                min="1"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">
                MXN
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Este monto se usará para crear el payment intent
            </p>
          </div>

          {/* Form Elements or Empty State */}
          {elements.length === 0 ? (
            <div className="py-12 text-center">
              <div className={`mb-4 ${isOver ? 'animate-bounce' : ''}`}>
                <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {isOver ? '¡Suelta aquí!' : 'Arrastra elementos aquí'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Arrastra el "Elemento de Pago" y opcionalmente "Detalles de Facturación" para construir tu checkout
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mounted Elements */}
              {elements.map((element) => (
                <div key={element.id} className="relative group">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {element.name}
                    </label>
                    <button
                      onClick={() => onRemove(element.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                      title="Eliminar elemento"
                    >
                      <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {element.type === 'payment' && (
                    <div id="live-payment-element" className="min-h-[200px]">
                      {!mounted && (
                        <div className="flex items-center justify-center h-[200px] bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="text-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-2"></div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Cargando elemento de pago...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {element.type === 'billing' && (
                    <div id="live-billing-element" className="min-h-[200px]">
                      {!mounted && (
                        <div className="flex items-center justify-center h-[200px] bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="text-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-2"></div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Cargando datos de facturación...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isOver && (
                <div className="border-2 border-blue-400 border-dashed rounded-xl p-4 bg-blue-50 dark:bg-blue-900/20 animate-pulse">
                  <p className="text-center text-blue-600 dark:text-blue-400 font-medium">
                    Suelta aquí para agregar
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onPayment}
              disabled={!hasPaymentElement || loading || processing || !mounted}
              className="w-full font-semibold py-3 px-6 transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2 disabled:opacity-60"
              style={{
                backgroundColor: buttonConfig?.backgroundColor || customColor,
                color: buttonConfig?.textColor || '#ffffff',
                fontFamily: buttonConfig?.fontFamily || fontFamily,
                fontSize: buttonConfig?.fontSize ? `${buttonConfig.fontSize}px` : '16px',
                borderRadius: buttonConfig?.borderRadius ? `${buttonConfig.borderRadius}px` : `${borderRadius}px`,
              }}
            >
              {processing ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Pagar ${(amount / 100).toFixed(2)} MXN
                </>
              )}
            </button>

            {!hasPaymentElement && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                Agrega el "Elemento de Pago" para habilitar el botón
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Result Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Resultado de la Transacción
        </h3>

        {result ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-400">
                    ¡Pago Exitoso!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    ID de transacción: {result.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Respuesta completa:</p>
              <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Esta transacción aparecerá en tu dashboard de comerciante.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
              Esperando transacción
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Completa el formulario y haz clic en pagar
            </p>
          </div>
        )}

        {/* Test Cards Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Tarjetas de Prueba
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Exitoso:</span>
              <code className="text-gray-900 dark:text-white font-mono text-xs">4242 4242 4242 4242</code>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Rechazado:</span>
              <code className="text-gray-900 dark:text-white font-mono text-xs">4000 0000 0000 0002</code>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">3DS:</span>
              <code className="text-gray-900 dark:text-white font-mono text-xs">4000 0027 6000 3184</code>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
            Usa cualquier fecha futura y CVV de 3 dígitos
          </p>
        </div>
      </div>
    </div>
  )
}