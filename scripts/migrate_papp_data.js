/**
 * @file migrate_papp_data.js
 * @description Script auxiliar para simular a migração de dados antigos de perfil de comunicação
 * para o novo formato de dados gerado pelo Plano de Ação de Processamento Profundo (PAPP).
 *
 * Este script é um exemplo funcional que demonstra a lógica de transformação de dados,
 * essencial para a manutenção e evolução da base de usuários do ComunicaPro.
 *
 * Uso: node scripts/migrate_papp_data.js
 */

// Dados de exemplo de perfis antigos
const oldProfiles = [
    {
        userId: 'user-001',
        v_score: 85, // Visual score (0-100)
        a_score: 50, // Auditory score (0-100)
        k_score: 30, // Kinesthetic score (0-100)
        preferred_modality: 'V',
        test_date: '2024-01-15T10:00:00Z',
    },
    {
        userId: 'user-002',
        v_score: 40,
        a_score: 95,
        k_score: 60,
        preferred_modality: 'A',
        test_date: '2023-11-20T14:30:00Z',
    },
    {
        userId: 'user-003',
        v_score: 65,
        a_score: 70,
        k_score: 80,
        preferred_modality: 'K',
        test_date: '2025-05-01T08:00:00Z',
    },
];

/**
 * Mapeia a modalidade preferida para a string completa.
 * @param {string} modality A modalidade V, A ou K.
 * @returns {string} O nome completo da preferência.
 */
function mapModality(modality) {
    switch (modality) {
        case 'V':
            return 'Visual';
        case 'A':
            return 'Auditivo';
        case 'K':
            return 'Cinestésico';
        default:
            return 'Visual';
    }
}

/**
 * Simula a geração de uma estratégia de processamento profundo baseada na modalidade.
 * Em um ambiente real, esta função chamaria a API do LLM.
 * @param {string} preference A preferência de comunicação.
 * @returns {string} Uma string com a estratégia sugerida.
 */
function generateDeepProcessingStrategy(preference) {
    switch (preference) {
        case 'Visual':
            return 'Utilize mapas mentais, infográficos e o método de loci para associar novas informações a imagens espaciais. Revise anotações usando cores e diagramas.';
        case 'Auditivo':
            return 'Grave-se lendo resumos, utilize a auto-explicação em voz alta e participe de discussões ativas para consolidar o aprendizado. Converta textos em áudio.';
        case 'Cinestésico':
            return 'Use aprendizado baseado em projetos (hands-on), faça pausas ativas a cada 30 minutos e utilize a escrita manual para reforçar a memória motora. Simule a aplicação prática do conhecimento.';
        default:
            return 'Estratégia genérica de processamento profundo.';
    }
}

/**
 * Função principal de migração.
 * @param {Object} profile O perfil antigo a ser migrado.
 * @returns {Object} O novo objeto de dados PAPP.
 */
function migrateProfileToPAPP(profile) {
    const preference = mapModality(profile.preferred_modality);
    const strategy = generateDeepProcessingStrategy(preference);

    return {
        userId: profile.userId,
        papp_id: `PAPP-${profile.userId}-${Date.now()}`, // Novo ID de PAPP
        communication_preference: preference,
        deep_processing_strategy: strategy,
        migration_timestamp: new Date().toISOString(),
        raw_scores: {
            visual: profile.v_score,
            auditory: profile.a_score,
            kinesthetic: profile.k_score,
        },
    };
}

/**
 * Executa a simulação de migração.
 */
function runMigrationSimulation() {
    console.log('--- Iniciando Simulação de Migração de Dados PAPP ---');
    console.log(`Total de perfis antigos encontrados: ${oldProfiles.length}`);
    console.log('----------------------------------------------------');

    const migratedData = oldProfiles.map((profile, index) => {
        console.log(`Migrando perfil ${index + 1}/${oldProfiles.length} (ID: ${profile.userId})...`);
        return migrateProfileToPAPP(profile);
    });

    console.log('----------------------------------------------------');
    console.log('Migração concluída. Dados transformados:');
    console.log(JSON.stringify(migratedData, null, 2));
    console.log('----------------------------------------------------');
    console.log('Simulação de migração de dados PAPP finalizada com sucesso.');
}

// Execução do script
runMigrationSimulation();
