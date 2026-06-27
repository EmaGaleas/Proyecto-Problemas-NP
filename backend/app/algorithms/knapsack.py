def knapsack_once_ideal(jugadores, desgaste_maximo):
    """
    Resuelve el problema de la mochila multidimensional usando Programación Dinámica (Top-Down).
    Maximizamos el valor táctico respetando el desgaste y la formación 4-3-3.
    """
    
    #Aqui se limita que sea una formacion 4-3-3
    LIMITES = {'PO': 1, 'DF': 4, 'MC': 3, 'DC': 3}
    
    #Guardamos estados que ya vimos para que no tengamos que revisarlos otra vez
    #Clave: (idJugador, desgasteRestante, cantidadPortero, cantidadDefensa, cantidadMediocampo, cantidadDelantero)
    #Valor: (maximoValorTactico, [listaIdsJugadores])
    memo = {}

    def dp(indice, desgaste_restante, po, df, mc, dc):
        #Caso 1: 
        if po == LIMITES['PO'] and df == LIMITES['DF'] and mc == LIMITES['MC'] and dc == LIMITES['DC']:
            return (0, [])

        #Caso 2: Se nos acabaron los jugadores o nos pasamos del desgaste
        #Retornamos -infinito para quitar esta combinacion
        if indice == len(jugadores) or desgaste_restante < 0:
            return (float('-inf'), [])

        #Verificamos si ya calculamos este estado antes
        estado = (indice, desgaste_restante, po, df, mc, dc)
        if estado in memo:
            return memo[estado]

        #Primera opcion: No incluir al jugador actual y pasar al siguiente
        valor_sin, alineacion_sin = dp(indice + 1, desgaste_restante, po, df, mc, dc)
        
        #Segunda opcion: Incluir al jugador actual solo si cumple las restricciones
        valor_con = float('-inf')
        alineacion_con = []
        
        jugador_actual = jugadores[indice]
        pos = jugador_actual['posicion']
        costo = jugador_actual['desgaste']
        beneficio = jugador_actual['valor_tactico']
        id_jug = jugador_actual['id_jugador']

        #Se evalua si podemos meterlo sin romper la mochila ni la formacion
        if desgaste_restante >= costo:
            if pos == 'PO' and po < LIMITES['PO']:
                res_val, res_alin = dp(indice + 1, desgaste_restante - costo, po + 1, df, mc, dc)
                valor_con = beneficio + res_val
                alineacion_con = [id_jug] + res_alin
                
            elif pos == 'DF' and df < LIMITES['DF']:
                res_val, res_alin = dp(indice + 1, desgaste_restante - costo, po, df + 1, mc, dc)
                valor_con = beneficio + res_val
                alineacion_con = [id_jug] + res_alin
                
            elif pos == 'MC' and mc < LIMITES['MC']:
                res_val, res_alin = dp(indice + 1, desgaste_restante - costo, po, df, mc + 1, dc)
                valor_con = beneficio + res_val
                alineacion_con = [id_jug] + res_alin
                
            elif pos == 'DC' and dc < LIMITES['DC']:
                res_val, res_alin = dp(indice + 1, desgaste_restante - costo, po, df, mc, dc + 1)
                valor_con = beneficio + res_val
                alineacion_con = [id_jug] + res_alin

        #Comparamos cual de las dos opciones tiene un mejor valor tactico
        if valor_con > valor_sin:
            memo[estado] = (valor_con, alineacion_con)
        else:
            memo[estado] = (valor_sin, alineacion_sin)

        return memo[estado]

    #Recursión desde el jugador 0, con el desgaste máximo completo y 0 jugadores elegidos
    valor_total, ids_seleccionados = dp(0, desgaste_maximo, 0, 0, 0, 0)

    #Preparamos la respuesta para la interfaz
    once_ideal = [j for j in jugadores if j['id_jugador'] in ids_seleccionados]
    desgaste_total = sum(j['desgaste'] for j in once_ideal)

    #Se valida si es posible hacer un equipo con ese valor de desgaste maximo
    if valor_total == float('-inf'):
        return {"error": "No hay suficientes jugadores válidos o el desgaste máximo es muy bajo para armar un 4-3-3."}

    return {
        "valor_tactico_total": valor_total,
        "desgaste_total_consumido": desgaste_total,
        "desgaste_maximo_permitido": desgaste_maximo,
        "plantilla": once_ideal
    }